import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { createDb } from "./db.js";
import { users, orders, quotes, messages, payments, statusLogs, documents } from "./schema.js";
import { checkRateLimit } from "./rate-limit.js";
import { sendWelcomeEmail, sendNewUserNotificationEmail, sendOrderConfirmationEmail, sendQuoteSentEmail, sendStatusChangeEmail, sendPasswordResetEmail, sendContactEmail, sendContactConfirmationEmail } from "./email.js";

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  RESEND_API_KEY: string;
  CORS_ORIGIN: string;
  CONTACT_INBOX_EMAIL?: string;
  DOCUMENTS_BUCKET: R2Bucket;
  BUILD_COMMIT?: string;
  BUILD_TIMESTAMP?: string;
  APP_URL: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
};

type UserPayload = { userId: number; role: "CLIENT" | "ADMIN"; email: string };
type Variables = { user: UserPayload };

const ORDER_STATUSES = [
  "NEW",
  "UNDER_REVIEW",
  "QUOTE_SENT",
  "APPROVED",
  "PAID",
  "IN_PROGRESS",
  "READY",
  "DOWNLOADED",
  "CANCELLED",
] as const;

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://linklang.co.uk",
  "https://www.linklang.co.uk",
];

app.use("*", secureHeaders());
app.use("*", async (c, next) => {
  const configured = (c.env.CORS_ORIGIN || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const allowedOrigins = configured.length > 0
    ? Array.from(new Set(configured.map((origin) => origin.toLowerCase())))
    : defaultAllowedOrigins;

  return cors({
    origin: (origin) => {
      if (!origin) return "http://localhost:5173";
      const normalized = origin.toLowerCase();

      if (allowedOrigins.includes(normalized)) return normalized;

      const wildcardMatch = allowedOrigins.some((allowed) =>
        allowed.includes("*") && normalized.endsWith(allowed.replace("*", ""))
      );

      if (wildcardMatch) return normalized;

      if (normalized.endsWith(".linklang.pages.dev") && configured.length === 0) return normalized;

      return allowedOrigins[0];
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })(c, next);
});



app.post("/api/contact", authRateLimit, async (c) => {
  const schema = z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email(),
    message: z.string().trim().min(1).max(5000),
  });
  const parsed = schema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return c.json({ error: "Invalid input" }, 400);

  const contactInbox = c.env.CONTACT_INBOX_EMAIL || "hello@linklang.co.uk";

  c.executionCtx.waitUntil(
    Promise.all([
      sendContactEmail(c.env.RESEND_API_KEY, contactInbox, parsed.data.name, parsed.data.email, parsed.data.message),
      sendContactConfirmationEmail(c.env.RESEND_API_KEY, parsed.data.email, parsed.data.name),
    ])
  );
  return c.json({ success: true }, 202);
});

function getJwtKey(env: Bindings) {
  if (!env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return new TextEncoder().encode(env.JWT_SECRET);
}

function getAppUrl(env: Bindings) {
  return env.APP_URL || (env.CORS_ORIGIN || "http://localhost:5173").split(",")[0].trim();
}

async function verifyStripeSignature(payload: string, signature: string | undefined, secret: string) {
  if (!signature || !secret) return false;

  const parts = Object.fromEntries(signature.split(",").map((part) => part.split("=", 2)));
  const timestamp = parts.t;
  const expectedSignature = parts.v1;
  if (!timestamp || !expectedSignature || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const actualSignature = Array.from(new Uint8Array(signed)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return actualSignature === expectedSignature;
}

async function authMiddleware(c: any, next: any) {
  const header = c.req.header("authorization");
  if (!header?.startsWith("Bearer ")) return c.json({ error: "Unauthorized" }, 401);
  try {
    const token = header.slice(7);
    const { payload } = await jwtVerify(token, getJwtKey(c.env));
    c.set("user", payload as unknown as UserPayload);
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
}

async function adminMiddleware(c: any, next: any) {
  const user = c.get("user") as UserPayload | undefined;
  if (!user || user.role !== "ADMIN") return c.json({ error: "Forbidden" }, 403);
  await next();
}

// Brute-force protection on auth endpoints (fixed window, backed by D1)
async function authRateLimit(c: any, next: any) {
  // Skip rate limiting in local development (D1 not initialized)
  if (!c.env.DB) {
    await next();
    return;
  }
  const ip = c.req.header("cf-connecting-ip") || "unknown";
  const ok = await checkRateLimit(c.env.DB, `rate:${c.req.path}:${ip}`, 20, 900);
  if (!ok) return c.json({ error: "Too many requests" }, 429);
  await next();
}

// Auth routes
app.post("/api/register", authRateLimit, async (c) => {
  const db = createDb(c.env.DB);
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().regex(passwordRegex, "Password must be at least 8 characters with uppercase, lowercase, digit, and special character"),
    captchaToken: z.string().optional(),
  });
  const parsed = schema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: parsed.error.flatten().fieldErrors.password?.[0] || "Invalid input" }, 400);

  const existing = await db.select().from(users).where(eq(users.email, parsed.data.email)).get();
  if (existing) return c.json({ error: "Email already exists" }, 409);

  const hashed = await bcrypt.hash(parsed.data.password, 10);
  const user = await db
    .insert(users)
    .values({ name: parsed.data.name, email: parsed.data.email, password: hashed })
    .returning()
    .get();

  const adminInbox = c.env.CONTACT_INBOX_EMAIL || "hello@linklang.co.uk";
  c.executionCtx.waitUntil(
    Promise.all([
      sendWelcomeEmail(c.env.RESEND_API_KEY, user.email, user.name || "Kliencie"),
      sendNewUserNotificationEmail(c.env.RESEND_API_KEY, adminInbox, user.name || "Nie podano", user.email),
    ]).then((results) => {
      if (results.includes(false)) console.error("Failed to send a registration notification email");
    })
  );

  return c.json({ id: user.id, email: user.email, name: user.name, role: user.role }, 201);
});

app.post("/api/login", authRateLimit, async (c) => {
  const db = createDb(c.env.DB);
  const schema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1),
  });
  const parsed = schema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: "Invalid input" }, 400);

  const user = await db.select().from(users).where(eq(users.email, parsed.data.email)).get();
  if (!user || !user.password) return c.json({ error: "Invalid credentials" }, 401);

  const valid = await bcrypt.compare(parsed.data.password, user.password);
  if (!valid) return c.json({ error: "Invalid credentials" }, 401);

  const token = await new SignJWT({ userId: user.id, role: user.role, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtKey(c.env));

  return c.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.post("/api/change-password", authMiddleware, async (c) => {
  const db = createDb(c.env.DB);
  const user = c.get("user");
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const schema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().regex(passwordRegex, "Password must be at least 8 characters with uppercase, lowercase, digit, and special character"),
  });
  const parsed = schema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: parsed.error.flatten().fieldErrors.newPassword?.[0] || "Invalid input" }, 400);

  const dbUser = await db.select().from(users).where(eq(users.id, user.userId)).get();
  if (!dbUser || !dbUser.password) return c.json({ error: "User not found" }, 404);

  const valid = await bcrypt.compare(parsed.data.currentPassword, dbUser.password);
  if (!valid) return c.json({ error: "Nieprawidłowe stare hasło" }, 401);

  const hashed = await bcrypt.hash(parsed.data.newPassword, 10);
  await db.update(users).set({ password: hashed }).where(eq(users.id, user.userId)).run();

  return c.json({ success: true });
});

app.get("/api/me", authMiddleware, async (c) => {
  const db = createDb(c.env.DB);
  const user = c.get("user");
  const dbUser = await db.select().from(users).where(eq(users.id, user.userId)).get();
  if (!dbUser) return c.json({ error: "User not found" }, 404);
  return c.json({ id: dbUser.id, email: dbUser.email, name: dbUser.name, role: dbUser.role });
});

// Orders
app.get("/api/orders", authMiddleware, async (c) => {
  const db = createDb(c.env.DB);
  const user = c.get("user");
  const isAdmin = user.role === "ADMIN";
  const where = isAdmin ? undefined : eq(orders.userId, user.userId);

  const list = await db.query.orders.findMany({
    where,
    with: {
      quotes: true,
      user: { columns: { name: true, email: true, phone: true } },
    },
    orderBy: [desc(orders.createdAt)],
  });

  // Single grouped query instead of one COUNT per order (avoids N+1)
  const counts = await db
    .select({ orderId: messages.orderId, count: sql<number>`count(*)` })
    .from(messages)
    .groupBy(messages.orderId)
    .all();
  const countByOrderId = new Map(counts.map((c) => [c.orderId, c.count]));

  const result = list.map((o: any) => ({
    ...o,
    messageCount: countByOrderId.get(o.id) || 0,
  }));

  return c.json(result);
});

app.post("/api/orders", authMiddleware, async (c) => {
  const db = createDb(c.env.DB);
  const user = c.get("user");
  const schema = z.object({
    type: z.enum(["TRANSLATION", "INTERPRETER", "PHONE_VIDEO", "PUBLIC_SERVICES", "BUSINESS"]),
    sourceLang: z.string().default("PL"),
    targetLang: z.string().default("EN"),
    deadline: z.string().optional(),
    location: z.string().optional(),
    context: z.string().optional(),
    durationMin: z.number().optional(),
    institution: z.string().optional(),
    notes: z.string().optional(),
  });
  const parsed = schema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const order = await db
    .insert(orders)
    .values({
      userId: user.userId,
      type: parsed.data.type,
      sourceLang: parsed.data.sourceLang,
      targetLang: parsed.data.targetLang,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : undefined,
      location: parsed.data.location,
      context: parsed.data.context,
      durationMin: parsed.data.durationMin,
      institution: parsed.data.institution,
      notes: parsed.data.notes,
    })
    .returning()
    .get();

  await db.insert(statusLogs).values({ orderId: order.id, status: "NEW", changedBy: user.userId }).run();

  const requester = await db.select().from(users).where(eq(users.id, user.userId)).get();
  if (requester) {
    c.executionCtx.waitUntil(
      sendOrderConfirmationEmail(c.env.RESEND_API_KEY, requester.email, requester.name || "Kliencie", order.id)
    );
  }

  return c.json(order, 201);
});

app.get("/api/orders/:id", authMiddleware, async (c) => {
  const db = createDb(c.env.DB);
  const user = c.get("user");
  const id = parseInt(c.req.param("id"));
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      quotes: true,
      documents: true,
      messages: { with: { user: { columns: { name: true } } }, orderBy: [messages.createdAt] },
      statusLogs: { orderBy: [statusLogs.createdAt] },
      user: { columns: { name: true, email: true, phone: true, company: true } },
    },
  });
  if (!order) return c.json({ error: "Not found" }, 404);
  if (user.role !== "ADMIN" && order.userId !== user.userId) return c.json({ error: "Forbidden" }, 403);
  return c.json(order);
});

app.patch("/api/orders/:id/status", authMiddleware, adminMiddleware, async (c) => {
  const db = createDb(c.env.DB);
  const user = c.get("user");
  const id = parseInt(c.req.param("id"));
  const schema = z.object({ status: z.enum(ORDER_STATUSES) });
  const parsed = schema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: "Invalid status" }, 400);

  const order = await db.update(orders).set({ status: parsed.data.status }).where(eq(orders.id, id)).returning().get();
  if (!order) return c.json({ error: "Not found" }, 404);

  await db.insert(statusLogs).values({ orderId: id, status: parsed.data.status, changedBy: user.userId }).run();

  const client = await db.select().from(users).where(eq(users.id, order.userId)).get();
  if (client) {
    c.executionCtx.waitUntil(
      sendStatusChangeEmail(c.env.RESEND_API_KEY, client.email, client.name || "Kliencie", order.id, parsed.data.status)
    );
  }

  return c.json(order);
});

// Quotes
app.post("/api/quotes", authMiddleware, adminMiddleware, async (c) => {
  const db = createDb(c.env.DB);
  const user = c.get("user");
  const schema = z.object({
    orderId: z.number(),
    amount: z.number().finite().positive().max(1000000),
    notes: z.string().optional(),
  });
  const parsed = schema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: "Invalid input" }, 400);

  const order = await db.select().from(orders).where(eq(orders.id, parsed.data.orderId)).get();
  if (!order) return c.json({ error: "Order not found" }, 404);

  const quote = await db
    .insert(quotes)
    .values({ orderId: parsed.data.orderId, userId: order.userId, amount: parsed.data.amount, notes: parsed.data.notes })
    .returning()
    .get();

  await db.update(orders).set({ status: "QUOTE_SENT" }).where(eq(orders.id, parsed.data.orderId)).run();
  await db
    .insert(statusLogs)
    .values({ orderId: parsed.data.orderId, status: "QUOTE_SENT", changedBy: user.userId })
    .run();

  const client = await db.select().from(users).where(eq(users.id, order.userId)).get();
  if (client) {
    c.executionCtx.waitUntil(
      sendQuoteSentEmail(c.env.RESEND_API_KEY, client.email, client.name || "Kliencie", order.id, quote.amount, quote.currency)
    );
  }

  return c.json(quote, 201);
});

app.post("/api/quotes/:id/accept", authMiddleware, async (c) => {
  const db = createDb(c.env.DB);
  const user = c.get("user");
  const quoteId = parseInt(c.req.param("id"));
  const quote = await db.select().from(quotes).where(eq(quotes.id, quoteId)).get();
  if (!quote) return c.json({ error: "Not found" }, 404);

  const order = await db.select().from(orders).where(eq(orders.id, quote.orderId)).get();
  if (!order || order.userId !== user.userId) return c.json({ error: "Forbidden" }, 403);

  await db.update(quotes).set({ accepted: true }).where(eq(quotes.id, quoteId)).run();
  await db.update(orders).set({ status: "APPROVED" }).where(eq(orders.id, quote.orderId)).run();
  await db.insert(statusLogs).values({ orderId: quote.orderId, status: "APPROVED", changedBy: user.userId }).run();

  return c.json({ success: true });
});

app.post("/api/quotes/:id/checkout", authMiddleware, async (c) => {
  const db = createDb(c.env.DB);
  const user = c.get("user");
  const quoteId = parseInt(c.req.param("id"));
  const quote = await db.select().from(quotes).where(eq(quotes.id, quoteId)).get();
  if (!quote) return c.json({ error: "Not found" }, 404);
  if (!quote.accepted || quote.userId !== user.userId) return c.json({ error: "Forbidden" }, 403);
  if (quote.paid) return c.json({ error: "Quote is already paid" }, 409);
  if (!c.env.STRIPE_SECRET_KEY) return c.json({ error: "Stripe is not configured" }, 503);

  const amount = Math.round(quote.amount * 100);
  if (amount < 1) return c.json({ error: "Invalid quote amount" }, 400);

  const form = new URLSearchParams({
    mode: "payment",
    "payment_method_types[0]": "card",
    "line_items[0][price_data][currency]": quote.currency.toLowerCase(),
    "line_items[0][price_data][product_data][name]": `LinkLang order #${quote.orderId}`,
    "line_items[0][price_data][unit_amount]": String(amount),
    "line_items[0][quantity]": "1",
    customer_email: user.email,
    client_reference_id: String(quote.id),
    success_url: `${getAppUrl(c.env)}/portal/${quote.orderId}?payment=success`,
    cancel_url: `${getAppUrl(c.env)}/portal/${quote.orderId}?payment=cancelled`,
  });
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${c.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });
  const session = await response.json() as { id?: string; url?: string; error?: { message?: string } };
  if (!response.ok || !session.id || !session.url) {
    console.error("Stripe Checkout error", session.error?.message);
    return c.json({ error: "Could not create payment session" }, 502);
  }

  await db.insert(payments).values({
    quoteId: quote.id,
    provider: "stripe",
    providerId: session.id,
    amount: quote.amount,
    status: "pending",
  }).run();

  return c.json({ checkoutUrl: session.url });
});

app.post("/api/stripe/webhook", async (c) => {
  const payload = await c.req.text();
  const valid = await verifyStripeSignature(payload, c.req.header("stripe-signature"), c.env.STRIPE_WEBHOOK_SECRET);
  if (!valid) return c.json({ error: "Invalid Stripe signature" }, 400);

  const event = JSON.parse(payload) as { type: string; data: { object: { id: string; payment_status?: string } } };
  if (event.type !== "checkout.session.completed" || event.data.object.payment_status !== "paid") {
    return c.json({ received: true });
  }

  const db = createDb(c.env.DB);
  const payment = await db.select().from(payments).where(eq(payments.providerId, event.data.object.id)).get();
  if (!payment || payment.status === "paid") return c.json({ received: true });

  const quote = await db.select().from(quotes).where(eq(quotes.id, payment.quoteId)).get();
  if (!quote) return c.json({ received: true });

  await db.update(payments).set({ status: "paid", paidAt: new Date() }).where(eq(payments.id, payment.id)).run();
  await db.update(quotes).set({ paid: true }).where(eq(quotes.id, quote.id)).run();
  await db.update(orders).set({ status: "PAID" }).where(eq(orders.id, quote.orderId)).run();
  await db.insert(statusLogs).values({ orderId: quote.orderId, status: "PAID", changedBy: quote.userId }).run();

  return c.json({ received: true });
});

// Messages
app.get("/api/orders/:id/messages", authMiddleware, async (c) => {
  const db = createDb(c.env.DB);
  const user = c.get("user");
  const orderId = parseInt(c.req.param("id"));
  const order = await db.select().from(orders).where(eq(orders.id, orderId)).get();
  if (!order) return c.json({ error: "Not found" }, 404);
  if (user.role !== "ADMIN" && order.userId !== user.userId) return c.json({ error: "Forbidden" }, 403);

  const msgs = await db.query.messages.findMany({
    where: eq(messages.orderId, orderId),
    with: { user: { columns: { name: true } } },
    orderBy: [messages.createdAt],
  });
  return c.json(msgs);
});

app.post("/api/orders/:id/messages", authMiddleware, async (c) => {
  const db = createDb(c.env.DB);
  const user = c.get("user");
  const orderId = parseInt(c.req.param("id"));
  const order = await db.select().from(orders).where(eq(orders.id, orderId)).get();
  if (!order) return c.json({ error: "Not found" }, 404);
  if (user.role !== "ADMIN" && order.userId !== user.userId) return c.json({ error: "Forbidden" }, 403);

  const schema = z.object({ content: z.string().min(1).max(2000) });
  const parsed = schema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: "Content required" }, 400);

  const msg = await db
    .insert(messages)
    .values({ orderId, userId: user.userId, content: parsed.data.content, isAdmin: user.role === "ADMIN" })
    .returning()
    .get();

  return c.json(msg, 201);
});

// Documents
app.post("/api/orders/:id/documents", authMiddleware, async (c) => {
  try {
    const db = createDb(c.env.DB);
    const user = c.get("user");
    const orderId = parseInt(c.req.param("id"));
    if (isNaN(orderId)) return c.json({ error: "Invalid order id" }, 400);

    const order = await db.select().from(orders).where(eq(orders.id, orderId)).get();
    if (!order) return c.json({ error: "Order not found" }, 404);
    if (order.userId !== user.userId && user.role !== "ADMIN") return c.json({ error: "Forbidden" }, 403);

    const bucket = c.env.DOCUMENTS_BUCKET;
    if (!bucket) return c.json({ error: "Document storage not configured" }, 500);

    const formData = await c.req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) return c.json({ error: "No file provided" }, 400);

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) return c.json({ error: "File too large (max 10MB)" }, 413);

    const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `orders/${orderId}/${crypto.randomUUID()}-${sanitized}`;

    await bucket.put(key, file, {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
      customMetadata: { uploadedBy: String(user.userId), orderId: String(orderId) },
    });

    const doc = await db.insert(documents).values({
      orderId,
      filename: file.name,
      url: key,
      isFinal: false,
    }).returning().get();

    return c.json(doc, 201);
  } catch (err) {
    console.error("Document upload error:", err);
    return c.json({ error: "Upload failed" }, 500);
  }
});

app.get("/api/orders/:id/documents/:docId/download", authMiddleware, async (c) => {
  try {
    const db = createDb(c.env.DB);
    const user = c.get("user");
    const orderId = parseInt(c.req.param("id"));
    const docId = parseInt(c.req.param("docId"));
    if (isNaN(orderId) || isNaN(docId)) return c.json({ error: "Invalid id" }, 400);

    const order = await db.select().from(orders).where(eq(orders.id, orderId)).get();
    if (!order) return c.json({ error: "Order not found" }, 404);
    if (order.userId !== user.userId && user.role !== "ADMIN") return c.json({ error: "Forbidden" }, 403);

    const doc = await db.select().from(documents).where(eq(documents.id, docId)).get();
    if (!doc || doc.orderId !== orderId) return c.json({ error: "Document not found" }, 404);

    const bucket = c.env.DOCUMENTS_BUCKET;
    if (!bucket) return c.json({ error: "Document storage not configured" }, 500);

    const object = await bucket.get(doc.url);
    if (!object) return c.json({ error: "File not found in storage" }, 404);

    const headers = new Headers();
    headers.set("Content-Type", object.httpMetadata?.contentType || "application/octet-stream");
    headers.set("Content-Disposition", `attachment; filename="${encodeURIComponent(doc.filename)}"`);
    if (object.size) headers.set("Content-Length", String(object.size));

    return new Response(object.body, { headers });
  } catch (err) {
    console.error("Document download error:", err);
    return c.json({ error: "Download failed" }, 500);
  }
});

// Admin summary
app.get("/api/admin/summary", authMiddleware, adminMiddleware, async (c) => {
  const db = createDb(c.env.DB);
  const allOrders = await db.select().from(orders).all();
  const allQuotes = await db.select().from(quotes).all();
  const revenue = allQuotes.filter((q) => q.paid || q.accepted).reduce((sum, q) => sum + q.amount, 0);

  return c.json({
    totalOrders: allOrders.length,
    revenue,
    byStatus: {
      new: allOrders.filter((o) => o.status === "NEW").length,
      quoteSent: allOrders.filter((o) => o.status === "QUOTE_SENT").length,
      approved: allOrders.filter((o) => o.status === "APPROVED").length,
      paid: allOrders.filter((o) => o.status === "PAID").length,
      inProgress: allOrders.filter((o) => o.status === "IN_PROGRESS").length,
      ready: allOrders.filter((o) => o.status === "READY").length,
      downloaded: allOrders.filter((o) => o.status === "DOWNLOADED").length,
    },
  });
});

// Password reset endpoints
app.post("/api/forgot-password", authRateLimit, async (c) => {
  let rawBody: unknown = null;
  try {
    rawBody = await c.req.json();
  } catch {
    // Malformed/empty JSON body — handled as invalid input.
  }

  const schema = z.object({ email: z.string().trim().toLowerCase().email() });
  const parsed = schema.safeParse(rawBody);
  if (!parsed.success) {
    return c.json({ error: "Invalid input" }, 400);
  }

  // For dev/local testing without DB, return success anyway
  if (!c.env.DB) {
    return c.json({ success: true }, 202);
  }

  const db = createDb(c.env.DB);

  // Case-insensitive lookup: emails are normalized on registration only since a later commit,
  // so older rows can still be stored in mixed case and would never match an exact comparison.
  const user = await db
    .select()
    .from(users)
    .where(sql`lower(${users.email}) = ${parsed.data.email}`)
    .get();
  if (!user) {
    return c.json({ success: true }, 202); // Don't leak if email exists
  }

  const resetToken = await new SignJWT({ email: user.email, purpose: "password_reset" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getJwtKey(c.env));

  const requestedOrigin = c.req.header("origin")?.replace(/\/$/, "");
  const configuredFrontendOrigins = (c.env.CORS_ORIGIN || "https://linklang.co.uk,https://www.linklang.co.uk")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
  const frontendOrigin = requestedOrigin && configuredFrontendOrigins.includes(requestedOrigin)
    ? requestedOrigin
    : "https://linklang.co.uk";
  const resetLink = `${frontendOrigin}/forgot-password?token=${resetToken}`;
  const sent = await sendPasswordResetEmail(c.env.RESEND_API_KEY, user.email, user.name || "Kliencie", resetLink);
  if (!sent) {
    return c.json({ error: "Nie udało się wysłać wiadomości. Spróbuj ponownie później." }, 503);
  }

  return c.json({ success: true }, 202);
});

app.post("/api/reset-password", async (c) => {
  const db = createDb(c.env.DB);
  const schema = z.object({
    token: z.string(),
    newPassword: z.string().regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters with uppercase, lowercase, digit, and special character"
    ),
  });
  const parsed = schema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: parsed.error.flatten().fieldErrors.newPassword?.[0] || "Invalid input" }, 400);

  try {
    const { payload } = await jwtVerify(parsed.data.token, getJwtKey(c.env));
    if (payload.purpose !== "password_reset") return c.json({ error: "Invalid token" }, 401);
    if (!payload.email) return c.json({ error: "Invalid token" }, 401);

    // For dev/local testing without DB, just return success
    if (!c.env.DB) {
      return c.json({ success: true }, 200);
    }

    const hashed = await bcrypt.hash(parsed.data.newPassword, 10);
    const user = await db.update(users).set({ password: hashed }).where(eq(users.email, payload.email as string)).returning().get();
    if (!user) return c.json({ error: "User not found" }, 404);

    return c.json({ success: true }, 200);
  } catch (err) {
    return c.json({ error: "Invalid token" }, 401);
  }
});

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

export default app;
