// Generates drizzle/seed.sql with demo data for local/remote D1.
// Run: node scripts/generate-seed.mjs && wrangler d1 execute linklang-db --local --file=./drizzle/seed.sql
import bcrypt from "bcryptjs";
import fs from "node:fs";

function esc(v) {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "1" : "0";
  return `'${String(v).replace(/'/g, "''")}'`;
}

function insert(table, row) {
  const cols = Object.keys(row);
  const vals = cols.map((c) => esc(row[c]));
  return `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${vals.join(", ")});`;
}

const adminPass = bcrypt.hashSync("admin123", 10);
const clientPass = bcrypt.hashSync("client123", 10);
const daysFromNow = (d) => Math.floor(Date.now() / 1000) + d * 86400;

const lines = [];

// users: 1=admin, 2=anna, 3=piotr
lines.push(insert("users", { id: 1, name: "Admin LinkLang", email: "admin@linklang.co.uk", password: adminPass, role: "ADMIN" }));
lines.push(insert("users", { id: 2, name: "Anna Kowalska", email: "anna@example.com", password: clientPass, role: "CLIENT", phone: "+44 7700 900001" }));
lines.push(insert("users", { id: 3, name: "Piotr Nowak", email: "piotr@example.com", password: clientPass, role: "CLIENT", company: "Polish Builders Ltd" }));

// order 1 — NEW
lines.push(insert("orders", { id: 1, user_id: 2, type: "TRANSLATION", status: "NEW", source_lang: "PL", target_lang: "EN", context: "contract", notes: "Umowa o pracę, 4 strony, pilne na czwartek", deadline: daysFromNow(3) }));
lines.push(insert("status_logs", { order_id: 1, status: "NEW", changed_by: 2 }));

// order 2 — QUOTE_SENT
lines.push(insert("orders", { id: 2, user_id: 2, type: "INTERPRETER", status: "QUOTE_SENT", source_lang: "PL", target_lang: "EN", location: "Aberdeen", duration_min: 120, notes: "Wizyta w Jobcentre Plus, tłumaczenie zwykłe", deadline: daysFromNow(7) }));
lines.push(insert("status_logs", { order_id: 2, status: "NEW", changed_by: 2 }));
lines.push(insert("status_logs", { order_id: 2, status: "QUOTE_SENT", changed_by: 1 }));
lines.push(insert("quotes", { order_id: 2, user_id: 2, amount: 140.0, notes: "2h x £70/h, dojazd wliczony" }));

// order 3 — APPROVED
lines.push(insert("orders", { id: 3, user_id: 3, type: "TRANSLATION", status: "APPROVED", source_lang: "EN", target_lang: "PL", context: "medical", notes: "Wyniki badań krwi, 2 strony", deadline: daysFromNow(2) }));
lines.push(insert("status_logs", { order_id: 3, status: "NEW", changed_by: 3 }));
lines.push(insert("status_logs", { order_id: 3, status: "QUOTE_SENT", changed_by: 1 }));
lines.push(insert("status_logs", { order_id: 3, status: "APPROVED", changed_by: 3 }));
lines.push(insert("quotes", { order_id: 3, user_id: 3, amount: 60.0, notes: "£30/strona, 2 strony", accepted: true }));

// order 4 — IN_PROGRESS
lines.push(insert("orders", { id: 4, user_id: 3, type: "PUBLIC_SERVICES", status: "IN_PROGRESS", source_lang: "PL", target_lang: "EN", institution: "NHS", notes: "Wizyta w szpitalu w Inverness, tłumaczenie medyczne", deadline: daysFromNow(5) }));
lines.push(insert("status_logs", { order_id: 4, status: "NEW", changed_by: 3 }));
lines.push(insert("status_logs", { order_id: 4, status: "QUOTE_SENT", changed_by: 1 }));
lines.push(insert("status_logs", { order_id: 4, status: "APPROVED", changed_by: 3 }));
lines.push(insert("status_logs", { order_id: 4, status: "PAID", changed_by: 3 }));
lines.push(insert("status_logs", { order_id: 4, status: "IN_PROGRESS", changed_by: 1 }));
lines.push(insert("quotes", { order_id: 4, user_id: 3, amount: 90.0, notes: "Tłumaczenie medyczne, 1.5h", accepted: true, paid: true }));

// order 5 — READY
lines.push(insert("orders", { id: 5, user_id: 2, type: "TRANSLATION", status: "READY", source_lang: "PL", target_lang: "EN", context: "certificate", notes: "Akt urodzenia, tłumaczenie zwykłe", deadline: daysFromNow(-1) }));
lines.push(insert("status_logs", { order_id: 5, status: "NEW", changed_by: 2 }));
lines.push(insert("status_logs", { order_id: 5, status: "QUOTE_SENT", changed_by: 1 }));
lines.push(insert("status_logs", { order_id: 5, status: "APPROVED", changed_by: 2 }));
lines.push(insert("status_logs", { order_id: 5, status: "PAID", changed_by: 2 }));
lines.push(insert("status_logs", { order_id: 5, status: "IN_PROGRESS", changed_by: 1 }));
lines.push(insert("status_logs", { order_id: 5, status: "READY", changed_by: 1 }));
lines.push(insert("quotes", { order_id: 5, user_id: 2, amount: 35.0, notes: "Akt urodzenia, 1 strona", accepted: true, paid: true }));

// messages
lines.push(insert("messages", { order_id: 2, user_id: 2, content: "Czy mogę prosić o wcześniejszy termin?" }));
lines.push(insert("messages", { order_id: 2, user_id: 1, content: "Tak, mogę w środę o 10:00. Pasuje?", is_admin: true }));
lines.push(insert("messages", { order_id: 2, user_id: 2, content: "Pasuje, dziękuję" }));
lines.push(insert("messages", { order_id: 4, user_id: 3, content: "Czy tłumacz zna terminologię onkologiczną?" }));
lines.push(insert("messages", { order_id: 4, user_id: 1, content: "Tak, mam doświadczenie w tłumaczeniach medycznych. Proszę o spokój.", is_admin: true }));

fs.mkdirSync("./drizzle", { recursive: true });
fs.writeFileSync("./drizzle/seed.sql", lines.join("\n") + "\n");

console.log("Wrote drizzle/seed.sql");
console.log("Admin: admin@linklang.co.uk / admin123");
console.log("Client 1: anna@example.com / client123");
console.log("Client 2: piotr@example.com / client123");
