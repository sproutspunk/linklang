# LinkLang

Polish-English translation and interpreting service website with a bilingual client portal and administration interface.

- Public website: <https://www.linklang.co.uk/>
- Production API: <https://api.linklang.co.uk/>
- Documentation reviewed against main on **16 November 2026**.

## Implemented scope

The website presents five service types: document translation, in-person interpreting, phone/video interpreting, public-services support and business services. Registered clients can create orders, attach documents, read and send order messages, accept quotations and start Stripe Checkout. Administrators can prepare quotations, update statuses and review orders.

Quotations are **created by an administrator**. This is not an automatic quotation engine. Messaging uses HTTP requests and explicit reloads in the order view; the source does not implement WebSocket or server-push chat. The public payment-preview page is a static UI example, not proof of a successful payment.

PL/EN switching covers the public pages, authentication, client/order views, help and payment preview. The interface includes cookie preferences and health-data consent records. These features do not by themselves establish full GDPR or WCAG compliance.

## Architecture and data responsibilities

| Component                                       | Responsibility                                                                                                    | Connections implemented in code                                                                                                      |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| React + TypeScript frontend on Cloudflare Pages | Public pages and account/order interface                                                                          | Sends API requests and receives responses; follows a returned Stripe Checkout URL                                                    |
| Hono API on Cloudflare Workers                  | Authentication, access checks and service workflow                                                                | Reads/writes D1; uploads/downloads R2 objects; creates Stripe Checkout sessions and receives Stripe webhooks; requests Resend emails |
| Cloudflare D1                                   | Accounts, orders, quotations, messages, document metadata, status/payment/consent records and rate-limit counters | Queried by the API through Drizzle and D1 APIs                                                                                       |
| Cloudflare R2                                   | Order document files                                                                                              | API writes uploaded files and reads files for authorised downloads                                                                   |
| Stripe Checkout                                 | Hosted payment flow                                                                                               | API requests a session and verifies the webhook before processing a paid session                                                     |
| Resend                                          | Transactional email delivery                                                                                      | API sends notifications through the email module                                                                                     |

The frontend uses React Router, Zustand, Tailwind CSS, Lucide icons and date-fns. The backend uses Hono, Drizzle, jose, bcryptjs and Zod. Declared dependencies and exact installed versions are recorded in the workspace package files and `package-lock.json`; the frontend currently declares Vite 8.2.1 or compatible updates, not Vite 5.

## Tracked project tree

This lists tracked files at the documentation review. Generated output, installed dependencies, local credentials and Wrangler local state are excluded.

```text
linklang/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── backend/
│   ├── migrations/
│   │   ├── 0001_init.sql
│   │   ├── 0002_normalize_user_emails.sql
│   │   └── 0003_health_consent_events.sql
│   ├── scripts/
│   │   └── generate-seed.mjs
│   ├── src/
│   │   ├── db.ts
│   │   ├── email.ts
│   │   ├── index.ts
│   │   ├── rate-limit.ts
│   │   └── schema.ts
│   ├── .dev.vars.example
│   ├── drizzle.config.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   │   ├── .well-known/
│   │   │   └── ard.json
│   │   ├── agent-skills/
│   │   │   └── linklang-enquiries/
│   │   │       └── SKILL.md
│   │   ├── _headers
│   │   ├── _redirects
│   │   ├── favicon.ico
│   │   ├── linklang_logo.svg
│   │   ├── llms.txt
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChangePasswordForm.tsx
│   │   │   ├── CookieBanner.tsx
│   │   │   ├── DocumentUpload.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── PasswordInput.tsx
│   │   ├── lib/
│   │   │   ├── analytics.ts
│   │   │   ├── api.ts
│   │   │   ├── labels.ts
│   │   │   ├── language.ts
│   │   │   ├── messages.ts
│   │   │   ├── store.ts
│   │   │   └── utils.ts
│   │   ├── pages/
│   │   │   ├── Admin.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── NewOrder.tsx
│   │   │   ├── OrderDetail.tsx
│   │   │   ├── PaymentPreview.tsx
│   │   │   ├── Portal.tsx
│   │   │   ├── Privacy.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Support.tsx
│   │   │   └── Terms.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── tests/
│   │   ├── analytics.browser.cjs
│   │   └── language.browser.cjs
│   ├── .env.production.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
├── CODE_OF_CONDUCT.md
├── LICENSE
├── linklang_logo.svg
├── package-lock.json
├── package.json
├── README.md
├── SECURITY.md
└── wrangler.toml
```

There is no root-level `migrations/` directory. D1 migrations live in `backend/migrations/`. The root `wrangler.toml` is the Worker configuration; DB and R2 bindings are declared in both its default and production environments.

## Local setup

Use **Node.js 24** to match CI, npm and Git. From a fresh checkout:

```bash
git clone https://github.com/sproutspunk/linklang.git
cd linklang
npm ci
cp backend/.dev.vars.example .dev.vars.production
```

Keep `.dev.vars.production` in the **repository root beside `wrangler.toml`**, not in `backend/`. Configure development values there; the file is ignored by Git:

```dotenv
JWT_SECRET=<random-development-secret>
RESEND_API_KEY=<development-email-key-if-needed>
CORS_ORIGIN=http://localhost:5173
APP_URL=http://localhost:5173
CONTACT_INBOX_EMAIL=<development-inbox-if-needed>
STRIPE_SECRET_KEY=<stripe-test-key-if-testing-checkout>
STRIPE_WEBHOOK_SECRET=<test-webhook-secret-if-needed>
```

Generate a development JWT secret with Node's `crypto.randomBytes` rather than copying a production secret. Use test credentials and controlled recipients when exercising integrations.

The example file's comment about production being the only configured environment is outdated; the current configuration also defines default bindings. Its instruction to place the env-specific file at the root remains relevant to `wrangler dev --env production`.

Start the local services:

```bash
npm run db:migrate:local -w backend
npm run dev
```

The root development script starts both workspaces. The frontend normally uses `http://localhost:5173`; the backend normally uses `http://localhost:8787`. Set `frontend/.env.development` with `VITE_API_URL=http://localhost:8787` if an explicit API override is needed. The API client otherwise chooses the production API on recognised production hosts and localhost for local development.

Use the actual Vite port in CORS if port 5173 is unavailable. Local Wrangler bindings use local development storage unless remote execution is explicitly selected.

### Database scripts

Use the backend's declared commands, such as `db:migrate:local` and `db:seed:local`. The root `db:seed` and `db:push` aliases reference backend script names that are not currently declared.

Local seed generation is intended for development. The remote-seed script requires an explicit override because it creates demonstration accounts; it is not a production setup step.

## Records and order lifecycle

Database definitions are in `backend/src/schema.ts`; SQL migrations are in `backend/migrations/`.

| SQL table               | Purpose                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `users`                 | User account, password hash and CLIENT/ADMIN role          |
| `orders`                | Service request, selected type, status and requirements    |
| `quotes`                | Administrator-created amount, acceptance and payment flags |
| `messages`              | Order-associated communication                             |
| `documents`             | File metadata and R2 object reference                      |
| `status_logs`           | Status-change records                                      |
| `payments`              | Provider/session reference and payment state               |
| `health_consent_events` | Versioned consent and withdrawal events                    |
| `rate_limits`           | D1-backed fixed-window rate counters                       |

Allowed order statuses are `NEW`, `UNDER_REVIEW`, `QUOTE_SENT`, `APPROVED`, `PAID`, `IN_PROGRESS`, `READY`, `DOWNLOADED` and `CANCELLED`. These describe the intended workflow; the administrator status endpoint validates the enum and relevant health-consent checks, rather than enforcing every transition in a strict state machine.

The new-order UI limits its initial file selection to five files. The upload endpoint enforces a per-file limit of 10 MiB. Files are stored in R2 and downloaded through an authenticated endpoint checking order ownership or administrator access and the document/order association.

### Health-data consent

Orders with medical context and public-services orders for NHS are treated as health-data orders by the backend. Consent events record the accepted text, language, versions, channel, timestamp and request ID. Clients can grant and withdraw consent; administrators can record a withdrawal received through another channel.

Active consent is checked before the relevant document/message operations and before moving a health-data order to `IN_PROGRESS` or `READY`. This is an implemented workflow, not an independent legal-compliance assessment or a claim that database administrators cannot alter stored records.

## Authentication and validation

Passwords are hashed with bcryptjs. Registration and password changes apply the password expression in `backend/src/index.ts`: at least eight characters, including upper/lowercase letters, a digit and an allowed special character. Login issues a JWT expiring after seven days. The client stores its auth token in localStorage.

The API uses Zod validation on defined request payloads and ownership/role checks on protected routes. Auth/contact rate-limit middleware uses D1 counters with a limit of 20 requests per 900-second window for the configured route/IP key. This does not establish that every endpoint has identical validation or rate limiting.

## API routes

The implementation in `backend/src/index.ts` is authoritative.

| Group           | Routes                                                                                                                                                                            |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication  | `POST /api/register`, `POST /api/login`, `GET /api/me`, `POST /api/change-password`, `POST /api/forgot-password`, `POST /api/reset-password`                                      |
| Orders          | `GET /api/orders`, `POST /api/orders`, `GET /api/orders/:id`, `PATCH /api/orders/:id/status` (administrator)                                                                      |
| Consent         | `GET /api/health-consent/text`, `POST /api/orders/:id/health-consent/grant`, `POST /api/orders/:id/health-consent/withdraw`, `POST /api/admin/orders/:id/health-consent/withdraw` |
| Quotes/payments | `POST /api/quotes` (administrator), `POST /api/quotes/:id/accept`, `POST /api/quotes/:id/checkout`, `POST /api/stripe/webhook`                                                    |
| Messages        | `GET /api/orders/:id/messages`, `POST /api/orders/:id/messages`                                                                                                                   |
| Documents       | `POST /api/orders/:id/documents`, `GET /api/orders/:id/documents/:docId/download`                                                                                                 |
| Administration  | `GET /api/admin/summary`                                                                                                                                                          |
| Public contact  | `POST /api/contact`                                                                                                                                                               |

Checkout uses the stored, accepted quotation amount and checks that the request belongs to the client. The webhook verifies Stripe's signature and processes a paid Checkout session. The static `/payment-preview` page is separate from this integration.

## Email notifications

The email module includes welcome and administrator new-user notifications, order confirmations, quotation notifications, status updates, password-reset links and public-contact notifications/acknowledgements. Delivery requires a working Resend configuration. Having a send call in code is not proof that a particular message reached an inbox.

## Deployment

The GitHub Actions workflow uses Node.js 24 and `npm ci`. On pushes to `main`, the backend job type-checks, applies remote D1 migrations and deploys the Worker. The frontend job builds and deploys `frontend/dist` to Pages. These are separate jobs, not a guaranteed sequential backend-then-frontend pipeline. Same-repository pull requests build and deploy a frontend preview, without deploying the backend.

The configured Worker name is `linklang-api`, with custom API domain `api.linklang.co.uk`. The default Pages project is `linklang`. CI requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (secret or supported repository variable). Frontend overrides include `VITE_API_URL`, `VITE_API_URL_PREVIEW` and `CLOUDFLARE_PAGES_PROJECT` as used in the workflow.

Configure the `DB` D1 binding, `DOCUMENTS_BUCKET` R2 binding and environment variables in root `wrangler.toml`. Runtime credentials include `JWT_SECRET`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`. Production CORS currently includes both the bare and www site hosts. Preserve the rest of the production variables when changing CORS.

Manual deployment commands, from the repository root after configuring infrastructure and credentials:

```bash
npm run typecheck -w backend
npx wrangler d1 migrations apply linklang-db --remote --env production --config wrangler.toml
npx wrangler deploy --env production --config wrangler.toml
npm run build -w frontend
npx wrangler pages deploy frontend/dist --project-name=linklang --branch=main
```

The configuration duplicates DB/R2 bindings between default and production environments to support deployment paths using either environment. The repository alone does not prove that no additional dashboard-managed deployment integrations exist.

## Validation and measured results

```bash
npm run typecheck -w backend
npm run build -w frontend
```

Browser-check scripts live in `frontend/tests/`. They use an externally installed Playwright module through `PLAYWRIGHT_MODULE`, a Chromium executable at `/usr/bin/chromium` and a running frontend. They are not exposed as an npm test script or run by the current deployment workflow. See each script's setup comment and `CHECK_URL` option.

Both TypeScript configurations enable strict mode. This repository does not currently provide ESLint/Prettier scripts or configuration, so those should not be described as enforced project checks.

Fixed bundle sizes and Lighthouse 100/100 claims have been removed: the tracked tree does not contain the dated reports needed to substantiate them for the current build. Report performance with the tested URL, commit, date, device/profile and tool version. No independent WCAG or GDPR certification is established by this README.

## Design and legal pages

Tailwind's brand palette defines bottle green `#0f3d2e`, off-white and slate colours; the base stylesheet also defines blue custom properties and light gradients. Typography and radii vary by component. Neither a universal 500 font weight nor a single 8px radius describes the entire implementation.

Public pages include privacy, terms, help and cookie preferences. They are application content, not evidence of legal certification. No newsletter opt-out system is implemented merely by the presence of transactional emails and cookie controls.

## License and contact

The committed [LICENSE](LICENSE) is **MIT**. The previous README's proprietary/all-rights-reserved statement conflicted with that file.

Website: <https://www.linklang.co.uk/>. Public service contact: <hello@linklang.co.uk>.
