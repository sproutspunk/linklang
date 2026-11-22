const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const api = fs.readFileSync("backend/src/index.ts", "utf8");
const mail = fs.readFileSync("backend/src/email.ts", "utf8");
const config = fs.readFileSync("wrangler.toml", "utf8");

const routeStart = api.indexOf('app.post("/api/contact"');
const routeEnd = api.indexOf("\n});", routeStart);
assert.ok(routeStart !== -1 && routeEnd > routeStart, "Contact endpoint exists");
const contact = api.slice(routeStart, routeEnd);

test("contact endpoint waits for Resend acceptance before success", () => {
  const awaitAt = contact.indexOf("await sendContactEmail(");
  const successAt = contact.indexOf("success: true");
  assert.ok(awaitAt >= 0, "Contact notification must be awaited");
  assert.ok(successAt > awaitAt, "Success response must happen after Resend acceptance");
  assert.match(contact, /if \(!accepted\)\s*\{/);
  assert.match(contact, /return c\.json\(\{ error: .*\}, 502\);/);
});

test("failed confirmation is secondary to owner notification", () => {
  const ackAt = contact.indexOf("sendContactConfirmationEmail(");
  const sendAt = contact.indexOf("await sendContactEmail(");
  assert.ok(ackAt > sendAt, "Confirmation is sent only after owner notification");
  assert.match(contact, /c\.executionCtx\.waitUntil\(/);
});

test("Resend response must contain an accepted message id", () => {
  assert.match(mail, /if \(error \|\| !data\?\.id\)/);
  assert.match(mail, /console\.error\("Resend rejected an email request"/);
});

test("both Wrangler environments route enquiries to LinkLang inbox", () => {
  const matches = config.match(/CONTACT_INBOX_EMAIL = "hello@linklang\.co\.uk"/g) || [];
  assert.equal(matches.length, 2);
  assert.doesNotMatch(config, /CONTACT_INBOX_EMAIL = "meereck@gmail\.com"/);
});
