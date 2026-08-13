import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name"),
  email: text("email").notNull().unique(),
  password: text("password"),
  role: text("role", { enum: ["CLIENT", "ADMIN"] }).notNull().default("CLIENT"),
  phone: text("phone"),
  company: text("company"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  messages: many(messages),
  quotes: many(quotes),
}));

export const orders = sqliteTable("orders", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type", { enum: ["TRANSLATION", "INTERPRETER", "PHONE_VIDEO", "PUBLIC_SERVICES", "BUSINESS"] }).notNull(),
  status: text("status", { enum: ["NEW", "UNDER_REVIEW", "QUOTE_SENT", "APPROVED", "PAID", "IN_PROGRESS", "READY", "DOWNLOADED", "CANCELLED"] }).notNull().default("NEW"),
  sourceLang: text("source_lang").notNull().default("PL"),
  targetLang: text("target_lang").notNull().default("EN"),
  deadline: integer("deadline", { mode: "timestamp" }),
  location: text("location"),
  context: text("context"),
  durationMin: integer("duration_min"),
  institution: text("institution"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  quotes: many(quotes),
  documents: many(documents),
  messages: many(messages),
  statusLogs: many(statusLogs),
}));

export const documents = sqliteTable("documents", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull().references(() => orders.id),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  isFinal: integer("is_final", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const documentsRelations = relations(documents, ({ one }) => ({
  order: one(orders, { fields: [documents.orderId], references: [orders.id] }),
}));

export const quotes = sqliteTable("quotes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull().references(() => orders.id),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: real("amount").notNull(),
  currency: text("currency").notNull().default("GBP"),
  wordCount: integer("word_count"),
  pageCount: integer("page_count"),
  notes: text("notes"),
  accepted: integer("accepted", { mode: "boolean" }).notNull().default(false),
  paid: integer("paid", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const quotesRelations = relations(quotes, ({ one }) => ({
  order: one(orders, { fields: [quotes.orderId], references: [orders.id] }),
  user: one(users, { fields: [quotes.userId], references: [users.id] }),
}));

export const messages = sqliteTable("messages", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull().references(() => orders.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  order: one(orders, { fields: [messages.orderId], references: [orders.id] }),
  user: one(users, { fields: [messages.userId], references: [users.id] }),
}));

export const statusLogs = sqliteTable("status_logs", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull().references(() => orders.id),
  status: text("status").notNull(),
  changedBy: integer("changed_by").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const statusLogsRelations = relations(statusLogs, ({ one }) => ({
  order: one(orders, { fields: [statusLogs.orderId], references: [orders.id] }),
}));

export const payments = sqliteTable("payments", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  quoteId: integer("quote_id").notNull().references(() => quotes.id),
  provider: text("provider").notNull().default("gocardless"),
  providerId: text("provider_id"),
  amount: real("amount").notNull(),
  status: text("status").notNull().default("pending"),
  paidAt: integer("paid_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Backs the D1-based fixed-window rate limiter for auth endpoints
export const rateLimits = sqliteTable("rate_limits", {
  rlKey: text("rl_key").primaryKey(),
  count: integer("count").notNull(),
  windowStart: integer("window_start").notNull(),
});
