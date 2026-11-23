const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { stripTypeScriptTypes } = require('node:module');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

// Execute the production module, removing only TypeScript syntax and module
// plumbing. The Resend transport is replaced so tests never send email.
const sourcePath = path.join(__dirname, '..', 'src', 'email.ts');
const source = readFileSync(sourcePath, 'utf8');
const exportedNames = [...source.matchAll(/^export function (\w+)\(/gm)].map((match) => match[1]);
const javascript = stripTypeScriptTypes(source, { mode: 'strip', sourceUrl: sourcePath })
  .replace(/^import \{ Resend \} from ["']resend["'];\s*$/m, 'const { Resend } = __dependencies;')
  .replace(/^export (?=function )/gm, '');
const script = new vm.Script(`${javascript}\n({ ${exportedNames.join(', ')} });`, { filename: sourcePath });

const API_KEY = 're_test_secret_must_never_appear_in_logs';
const RECIPIENT = 'private-inbox@example.com';
const CUSTOMER_EMAIL = 'private-customer@example.net';
const CUSTOMER_NAME = 'Private Customer';
const MESSAGE = 'Private enquiry that must not appear in logs';

function loadModule(result, { throwOnConstruction = false } = {}) {
  const requests = [];
  const keys = [];
  const logs = [];
  class Resend {
    constructor(apiKey) {
      keys.push(apiKey);
      if (throwOnConstruction) throw new Error(`${API_KEY}: ${MESSAGE}`);
      this.emails = {
        send: async (payload) => {
          requests.push(JSON.parse(JSON.stringify(payload)));
          if (typeof result === 'function') return result(payload);
          return result;
        },
      };
    }
  }
  const context = vm.createContext({
    __dependencies: { Resend },
    console: { error: (...args) => logs.push(args) },
  });
  return { ...script.runInContext(context), requests, keys, logs };
}

function sendContact(module) {
  return module.sendContactEmail(API_KEY, RECIPIENT, CUSTOMER_NAME, CUSTOMER_EMAIL, MESSAGE);
}

function assertPrivateLogs(logs, extra = []) {
  const rendered = JSON.stringify(logs);
  for (const value of [API_KEY, RECIPIENT, CUSTOMER_EMAIL, CUSTOMER_NAME, MESSAGE, ...extra]) {
    assert.equal(rendered.includes(value), false, `Logs exposed a private value: ${value}`);
  }
}

test('an accepted contact email preserves routing and escapes all HTML inputs', async () => {
  const module = loadModule({ data: { id: 'accepted-email-id' }, error: null });
  const accepted = await module.sendContactEmail(
    API_KEY,
    RECIPIENT,
    'Alice <Admin> & "Bob" \'Co\'',
    'alice+&\'tag@example.com',
    '<script>alert("x")</script>\nFish & chips \'today\''
  );
  assert.equal(accepted, true);
  assert.deepEqual(module.keys, [API_KEY]);
  assert.equal(module.requests.length, 1);
  const payload = module.requests[0];
  assert.equal(payload.from, 'LinkLang <hello@linklang.co.uk>');
  assert.equal(payload.to, RECIPIENT);
  assert.equal(payload.replyTo, 'alice+&\'tag@example.com');
  assert.equal(payload.subject, 'Nowa wiadomość kontaktowa od Alice <Admin> & "Bob" \'Co\'');
  assert.ok(payload.html.includes('Alice &lt;Admin&gt; &amp; &quot;Bob&quot; &#39;Co&#39;'));
  assert.ok(payload.html.includes('alice+&amp;&#39;tag@example.com'));
  assert.ok(payload.html.includes('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;<br>Fish &amp; chips &#39;today&#39;'));
  assert.equal(payload.html.includes('<script>'), false);
  assert.deepEqual(module.logs, []);
});

test('an SDK error takes precedence over a returned message ID', async () => {
  const module = loadModule({
    data: { id: 'unreliable-id' },
    error: { name: 'validation_error', statusCode: 401, message: `API key is invalid: ${API_KEY}` },
  });
  assert.equal(await sendContact(module), false);
  assert.equal(module.logs.length, 1);
  assert.equal(module.logs[0][0], 'Resend rejected an email request');
  assert.equal(module.logs[0][1].name, 'validation_error');
  assert.equal(module.logs[0][1].statusCode, 401);
  assert.equal(module.logs[0][1].reason, 'api_key_rejected');
  assertPrivateLogs(module.logs);
});

test('an absent or empty provider message ID cannot count as acceptance', async (t) => {
  for (const [label, data] of [['null data', null], ['missing ID', {}], ['empty ID', { id: '' }]]) {
    await t.test(label, async () => {
      const module = loadModule({ data, error: null });
      assert.equal(await sendContact(module), false);
      assert.equal(module.logs[0][1].reason, 'missing_message_id');
      assert.equal(module.logs[0][1].statusCode, 0);
      assertPrivateLogs(module.logs);
    });
  }
});

test('SDK transport and construction exceptions return false without disclosing details', async (t) => {
  const privateFailure = `Transport failed ${API_KEY} ${CUSTOMER_EMAIL} ${MESSAGE}`;
  for (const [label, module] of [
    ['transport', loadModule(() => { throw new Error(privateFailure); })],
    ['construction', loadModule(null, { throwOnConstruction: true })],
  ]) {
    await t.test(label, async () => {
      assert.equal(await sendContact(module), false);
      assert.deepEqual(module.logs, [['Resend email request failed unexpectedly']]);
      assertPrivateLogs(module.logs, [privateFailure]);
    });
  }
});

test('provider rejection logs retain only diagnostic status and an allowlisted reason', async (t) => {
  const cases = [
    ['invalid key', 401, `API key is invalid: ${API_KEY}`, 'api_key_rejected'],
    ['unverified domain', 403, 'The example.com domain is not verified. Please, add and verify your domain.', 'sender_domain_unverified'],
    ['testing recipient', 403, `You can only send testing emails to your own email address (${CUSTOMER_EMAIL}).`, 'testing_recipient_restricted'],
    ['invalid sender', 422, 'Invalid `from` field. The email address needs to follow the required format.', 'invalid_sender'],
    ['invalid recipient', 422, 'Invalid `to` field. The email address needs to follow the required format.', 'invalid_recipient'],
    ['invalid reply address', 400, 'Invalid `reply_to` field.', 'invalid_reply_to'],
    ['rate limit', 429, 'Too many requests.', 'rate_limited'],
    ['unknown detail', 422, `Opaque provider detail: ${API_KEY} ${CUSTOMER_EMAIL} ${MESSAGE}`, 'unclassified_provider_error'],
  ];
  for (const [label, statusCode, providerMessage, reason] of cases) {
    await t.test(label, async () => {
      const module = loadModule({ data: null, error: { name: 'validation_error', statusCode, message: providerMessage } });
      assert.equal(await sendContact(module), false);
      assert.equal(module.logs.length, 1);
      const detail = module.logs[0][1];
      assert.deepEqual(Object.keys(detail).sort(), ['name', 'reason', 'statusCode']);
      assert.equal(detail.name, 'validation_error');
      assert.equal(detail.statusCode, statusCode);
      assert.equal(detail.reason, reason);
      assertPrivateLogs(module.logs, [providerMessage]);
    });
  }
});

test('an absent or nonnumeric provider status becomes a safe diagnostic fallback', async (t) => {
  for (const [label, statusCode] of [['absent', undefined], ['null', null], ['string', '401']]) {
    await t.test(label, async () => {
      const module = loadModule({ data: null, error: { name: 'validation_error', statusCode, message: 'API key is invalid' } });
      assert.equal(await sendContact(module), false);
      assert.equal(module.logs[0][1].statusCode, 0);
      assert.equal(module.logs[0][1].reason, 'api_key_rejected');
      assertPrivateLogs(module.logs);
    });
  }
});

test('contact acknowledgement sends to the customer without inheriting a Reply-To', async () => {
  const module = loadModule({ data: { id: 'acknowledgement-id' }, error: null });
  assert.equal(await module.sendContactConfirmationEmail(API_KEY, CUSTOMER_EMAIL, '<Customer>'), true);
  assert.equal(module.requests[0].to, CUSTOMER_EMAIL);
  assert.equal(module.requests[0].from, 'LinkLang <hello@linklang.co.uk>');
  assert.equal(Object.hasOwn(module.requests[0], 'replyTo'), false);
  assert.ok(module.requests[0].html.includes('&lt;Customer&gt;'));
  assert.deepEqual(module.logs, []);
});


test('registration emails preserve routing and never expose provider error names', async (t) => {
  for (const kind of ['welcome', 'admin']) {
    for (const failure of ['success', 'private-name', 'missing-id', 'throw']) {
      await t.test(kind + ' ' + failure, async () => {
        const module = loadModule(() => {
          if (failure === 'throw') throw new Error(API_KEY + CUSTOMER_EMAIL);
          if (failure === 'private-name') return { data: null, error: { name: CUSTOMER_EMAIL + API_KEY, message: MESSAGE, statusCode: 422 } };
          return { data: failure === 'success' ? { id: 'mock-id' } : null, error: null };
        });
        const result = kind === 'welcome'
          ? await module.sendWelcomeEmail(API_KEY, CUSTOMER_EMAIL, '<Customer>')
          : await module.sendNewUserNotificationEmail(API_KEY, 'hello@linklang.co.uk', '<Customer>', CUSTOMER_EMAIL);
        assert.equal(result, failure === 'success');
        assert.equal(module.requests.length, 1);
        assert.equal(module.requests[0].to, kind === 'welcome' ? CUSTOMER_EMAIL : 'hello@linklang.co.uk');
        assert.ok(module.requests[0].html.includes('&lt;Customer&gt;'));
        assert.equal(Object.hasOwn(module.requests[0], 'replyTo'), false);
        assertPrivateLogs(module.logs);
        if (failure === 'private-name') assert.equal(module.logs[0][1].name, 'unknown_provider_error');
      });
    }
  }
});
