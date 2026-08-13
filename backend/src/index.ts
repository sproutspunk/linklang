import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { createDb } from "./db.js";
import { users, orders, quotes, messages, statusLogs } from "./schema.js";
import { checkRateLimit } from "./rate-limit.js";
import { sendWelcomeEmail, sendOrderConfirmationEmail, sendQuoteSentEmail, sendStatusChangeEmail } from "./email.js";

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  RESEND_API_KEY: string;
  CORS_ORIGIN: string;
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

app.use("*", secureHeaders());
app.use("*", async (c, next) => {
  const allowedOrigins = (c.env.CORS_ORIGIN || "http://localhost:5173").split(",").map((o) => o.trim());
  return cors({ origin: allowedOrigins, credentials: true })(c, next);
});

function getJwtKey(env: Bindings) {
  if (!env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return new TextEncoder().encode(env.JWT_SECRET);
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
  const ip = c.req.header("cf-connecting-ip") || "unknown";
  const ok = await checkRateLimit(c.env.DB, `auth:${ip}`, 20, 900);
  if (!ok) return c.json({ error: "Too many requests" }, 429);
  await next();
}

// Auth routes
app.post("/api/register", authRateLimit, async (c) => {
  const db = createDb(c.env.DB);
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
  });
  const parsed = schema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: "Invalid input" }, 400);

  const existing = await db.select().from(users).where(eq(users.email, parsed.data.email)).get();
  if (existing) return c.json({ error: "Email already exists" }, 409);

  const hashed = await bcrypt.hash(parsed.data.password, 10);
  const user = await db
    .insert(users)
    .values({ name: parsed.data.name, email: parsed.data.email, password: hashed })
    .returning()
    .get();

  c.executionCtx.waitUntil(sendWelcomeEmail(c.env.RESEND_API_KEY, user.email, user.name || "Kliencie"));

  return c.json({ id: user.id, email: user.email, name: user.name, role: user.role }, 201);
});

app.post("/api/login", authRateLimit, async (c) => {
  const db = createDb(c.env.DB);
  const schema = z.object({
    email: z.string().email(),
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
    amount: z.number(),
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

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

export default app;
