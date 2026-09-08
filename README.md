# LinkLang - Professional Translation & Interpreting Services

A modern, full-stack web application for managing translation and interpreting services. Built with React, TypeScript, Hono, and Cloudflare infrastructure.

**Live:** https://linklang.co.uk

---

## 🎯 Project Overview

LinkLang is a professional translation services platform that connects clients with qualified translators and interpreters. The platform streamlines service requests, quote generation, payment processing, and real-time communication.

### Key Features

- **Service Management**: Document translation, on-site interpreting, phone/video interpreting, public services support, and corporate packages
- **Quote System**: Automated quote generation and client acceptance
- **Secure Authentication**: JWT-based auth with strong password requirements (8+ chars, uppercase, lowercase, numbers, special chars)
- **Real-time Communication**: Messaging system between clients and service providers
- **Payment Processing**: Online payment integration
- **Admin Dashboard**: Comprehensive order and client management
- **Health-data Consent**: Versioned, auditable consent for medical orders and NHS requests, with client withdrawal and administrator records
- **Multi-language Support**: PL/EN content and language switching throughout public and client views
- **Support Centre**: PL/EN help page for common service, account, payment, and privacy questions
- **Cookie Management**: Transparent cookie preferences with GDPR compliance
- **Responsive Design**: Mobile-first design with Tailwind CSS

---

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18.3.1 with TypeScript
- Vite 5.3.4 (build tool)
- React Router DOM 6.25.1
- Zustand 4.5.4 (state management)
- Tailwind CSS 3.4.4
- Lucide React (icons)
- date-fns 3.6.0 (date formatting)

**Backend:**
- Hono 4.13.2 (HTTP framework for Cloudflare Workers)
- Drizzle ORM 0.45.2
- SQLite with Cloudflare D1
- JWT Authentication (jose 6.2.8)
- bcryptjs 2.4.3 (password hashing)
- Zod 3.23.8 (validation)
- Resend 6.19.0 (email service)
- Stripe Checkout (payment processing, called via REST API)

**Infrastructure:**
- Cloudflare Workers (serverless backend)
- Cloudflare Pages (frontend hosting)
- Cloudflare D1 (SQLite database)

---

## 📁 Project Structure

```
linklang-vite/
├── backend/                    # Hono/Cloudflare Workers API
│   ├── src/
│   │   ├── index.ts           # Main API routes & middleware
│   │   ├── schema.ts          # Drizzle ORM database schema
│   │   ├── db.ts              # Database connection setup
│   │   ├── email.ts           # Email notification service
│   │   └── rate-limit.ts      # Anti-brute-force protection
│   ├── migrations/            # Database migrations
│   └── package.json
│
├── frontend/                   # React SPA with Vite
│   ├── src/
│   │   ├── pages/             # Route pages
│   │   │   ├── Home.tsx       # Landing page
│   │   │   ├── Login.tsx      # Login page
│   │   │   ├── Register.tsx       # Registration
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── Privacy.tsx    # Privacy policy
│   │   │   ├── Terms.tsx      # Terms & conditions
│   │   │   ├── Support.tsx    # Support centre
│   │   │   ├── Portal.tsx     # Client dashboard
│   │   │   ├── NewOrder.tsx   # Create order form
│   │   │   ├── OrderDetail.tsx # Order communication hub
│   │   │   ├── PaymentPreview.tsx # Stripe checkout preview
│   │   │   └── Admin.tsx      # Admin dashboard
│   │   ├── components/
│   │   │   ├── Layout.tsx     # Main layout wrapper
│   │   │   ├── Navbar.tsx     # Navigation bar
│   │   │   ├── CookieBanner.tsx # Cookie preferences
│   │   │   ├── ChangePasswordForm.tsx # Account password change
│   │   │   ├── DocumentUpload.tsx # Order document upload
│   │   │   └── PasswordInput.tsx # Password field with show/hide toggle
│   │   ├── lib/
│   │   │   ├── store.ts       # Zustand auth state
│   │   │   ├── api.ts         # API client wrapper
│   │   │   └── utils.ts       # Helper functions
│   │   ├── App.tsx            # Route definitions
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── public/
│   │   ├── robots.txt         # SEO robots file
│   │   ├── sitemap.xml        # SEO sitemap
│   │   ├── llms.txt           # AI agent guidelines
│   │   └── linklang_logo.svg  # Brand logo
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── migrations/                # Database migration files
├── wrangler.toml             # Root Cloudflare config
├── package.json              # Root workspace config
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Local Development Setup

1. **Clone & Install**
```bash
git clone https://github.com/sproutspunk/linklang.git
cd linklang-vite
npm install
```

2. **Configure Environment Variables**

**Backend** - Create `backend/.dev.vars`:
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

# Then create .dev.vars:
JWT_SECRET=<your-generated-secret>
RESEND_API_KEY=<resend-api-key-for-emails>
CORS_ORIGIN=http://localhost:5173,https://linklang.co.uk
APP_URL=http://localhost:5173
CONTACT_INBOX_EMAIL=<inbox-for-contact-form-and-signup-notifications>
STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-signing-secret>
```

**Frontend** - Create `frontend/.env.development`:
```
VITE_API_URL=http://localhost:8787
```

3. **Run Development Server**
```bash
npm run dev
```

This starts both:
- **Frontend**: http://localhost:5173 (or next available port)
- **Backend**: http://localhost:8787

---

## 📊 Database Schema

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | User accounts | id, name, email, password (hashed), role (CLIENT/ADMIN), phone, company |
| `orders` | Service requests | id, userId, type, status, sourceLang, targetLang, deadline, location, context |
| `quotes` | Price quotes | id, orderId, userId, amount, currency, accepted, paid |
| `messages` | Order communication | id, orderId, userId, content, isAdmin |
| `documents` | Uploaded files | id, orderId, filename, url, isFinal |
| `statusLogs` | Audit trail | id, orderId, status, changedBy |
| `payments` | Payment records | id, quoteId, provider, amount, status |
| `healthConsentEvents` | Immutable health-data consent audit trail | orderId, clientId, action, channel, language, consentVersion, privacyPolicyVersion, requestId |
| `rateLimits` | Rate limit tracking | rlKey (PK), count, windowStart |

### Order Types
- TRANSLATION
- INTERPRETER
- PHONE_VIDEO
- PUBLIC_SERVICES
- BUSINESS

### Order Status Flow
```
NEW → UNDER_REVIEW → QUOTE_SENT → APPROVED → PAID → IN_PROGRESS → READY → DOWNLOADED
↓ (Anytime)
CANCELLED
```

### Health-data Consent

- Translation orders with `context: medical` and public-services orders with `institution: nhs` are health-data orders.
- The client must actively confirm the server-provided consent text before submitting an NHS request with documents.
- A client can grant, withdraw, and grant consent again from the order detail view.
- Consent events preserve the accepted text, language, consent and privacy-policy versions, channel, timestamps, and idempotency request ID.
- Active consent is required before uploading documents containing health data, sending health-data messages, or advancing a health-data order to `IN_PROGRESS` or `READY`.
- Administrators can view consent history and record a withdrawal received by email or phone.

---

## 🔐 Security Features

- **Password Requirements**: 8+ characters, uppercase, lowercase, number, special character
- **JWT Authentication**: 7-day token expiration
- **Rate Limiting**: Anti-brute-force protection (20 requests/900s on auth endpoints)
- **HTTPS**: All production traffic encrypted
- **CORS Protection**: Configurable allowed origins
- **Input Validation**: Zod schema validation on all endpoints
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM

---

## 📧 Email Notifications

Triggered via Resend API:

| Event | Recipients | Purpose |
|-------|-----------|---------|
| Registration | New user | Welcome email |
| Order Created | Client | Order confirmation |
| Quote Sent | Client | Quote notification with amount |
| Status Changed | Client | Order status update |
| Contact Form | Admin + sender | New inquiry confirmation |

---

## 🌐 Deployment

Production deploys use the root `wrangler.toml`. The Worker is named
`linklang-api` and serves `api.linklang.co.uk`; the frontend is deployed to the
Cloudflare Pages project `linklang`.

### Frontend (Cloudflare Pages)

```bash
npm run build -w frontend
npx wrangler pages deploy frontend/dist --project-name=linklang --branch=main
```

### Backend (Cloudflare Workers)

```bash
# Run from the repository root.
npx wrangler deploy --env production --config wrangler.toml
```

### Environment Setup (Production)

1. **Cloudflare Dashboard** → Workers & Pages → Settings
2. Create the R2 bucket used for order document uploads (name must match
   `wrangler.toml`'s `[[env.production.r2_buckets]]` binding):
```bash
npx wrangler r2 bucket create linklang-documents
```
3. Set secrets:
```bash
npx wrangler secret put JWT_SECRET --env production
npx wrangler secret put RESEND_API_KEY --env production
npx wrangler secret put STRIPE_SECRET_KEY --env production
npx wrangler secret put STRIPE_WEBHOOK_SECRET --env production
```
4. **GitHub Actions** repo secrets/vars: `CLOUDFLARE_API_TOKEN`,
   `CLOUDFLARE_ACCOUNT_ID` (secret or repo variable), optional
   `VITE_API_URL`, `CLOUDFLARE_PAGES_PROJECT`.

5. **Configure CORS**:
Update `wrangler.toml`:
```toml
[env.production]
vars = { CORS_ORIGIN = "https://linklang.co.uk" }
```

6. **Apply D1 migrations on remote** (also done automatically by CI on every
   push to `main`, but useful to run manually / verify):
```bash
npx wrangler d1 migrations apply linklang-db --remote --env production --config wrangler.toml

# Verify no legacy mixed-case emails remain (must return 0):
npx wrangler d1 execute linklang-db --remote --env production \
  --command "SELECT COUNT(*) AS mixed FROM users WHERE email != LOWER(email)"
```

---

## 📈 Performance

- **Frontend Build**: 67.35 KB (gzipped)
- **Backend Worker**: 134.20 KB (gzipped)
- **Lighthouse Scores**: 
  - Performance: 100/100
  - Accessibility: 100/100
  - Best Practices: 100/100
  - SEO: 100/100

---

## 🎨 Design System

### Color Palette

- **Primary Brand Color**: `#0f3d2e` (Bottle Green)
- **Backgrounds**: `#f7f7f5` (Off-white), `#ffffff` (White)
- **Text**: Slate color scale (900-50)
- **Accents**: Brand-600 for interactive elements

### Typography

- **Font Family**: System stack (Tailwind default)
- **Font Weights**: 500 (medium) for consistency
- **Headings**: Medium weight, slate-900
- **Body**: Small/xs sizes with slate-600 for descriptions

### Spacing & Layout

- **Max Width**: 6xl (64rem) for content
- **Grid**: Responsive 1-2-3 columns
- **Shadows**: Subtle, brand-tinted shadows
- **Border Radius**: 8px (rounded-lg)

---

## 🔄 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/me` - Get current user info
- `POST /api/change-password` - Change own password
- `POST /api/forgot-password` - Request password reset email
- `POST /api/reset-password` - Reset password with emailed token

### Orders
- `GET /api/orders` - List orders (role-based filtering)
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status (admin only)

### Health-data Consent
- `GET /api/health-consent/text?language=PL|EN` - Get the current server-controlled consent text (authenticated)
- `POST /api/orders/:id/health-consent/grant` - Grant consent for the client-owned health-data order
- `POST /api/orders/:id/health-consent/withdraw` - Withdraw consent for the client-owned health-data order
- `POST /api/admin/orders/:id/health-consent/withdraw` - Record a withdrawal received by email or phone (admin only)

### Quotes & Payments
- `POST /api/quotes` - Create quote (admin only)
- `POST /api/quotes/:id/accept` - Accept quote
- `POST /api/quotes/:id/checkout` - Start Stripe Checkout session for an accepted quote
- `POST /api/stripe/webhook` - Stripe webhook, marks quote/payment as paid

### Communication
- `GET /api/orders/:id/messages` - Get order messages
- `POST /api/orders/:id/messages` - Send message

### Documents
- `POST /api/orders/:id/documents` - Upload a document to an order
- `GET /api/orders/:id/documents/:docId/download` - Download an order document

### Admin
- `GET /api/admin/summary` - Dashboard statistics

### Contact
- `POST /api/contact` - Submit contact form (sends to admin + confirmation to user)

---

## 🌍 Internationalization

The platform supports **Polish (PL)** and **English (EN)** with:
- Language selection stored in localStorage
- The navigation language switch updates public, authentication, client order, support, and payment-preview views
- Cookie banner respects language preference
- Client-facing UI text translated in component code
- Content object pattern for translations

---

## 📝 Legal & Compliance

- ✅ Privacy Policy (`/privacy`)
- ✅ Terms & Conditions (`/terms`)
- ✅ Cookie Preferences with granular controls
- ✅ Versioned consent records for health data
- ✅ GDPR-compliant data handling
- ✅ Secure password storage with bcryptjs
- ✅ Email opt-out support

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/description`
2. Commit changes: `git commit -m "feat: description"`
3. Push to branch: `git push origin feature/description`
4. Open Pull Request

### Code Standards
- TypeScript strict mode enabled
- Eslint & Prettier formatting
- Zod schema validation
- Component-based architecture

---

## 📞 Support & Contact

- **Email**: hello@linklang.co.uk
- **Phone**: 07770 110735
- **Website**: https://linklang.co.uk

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🙏 Acknowledgments

Built with modern web technologies prioritizing:
- **Security**: Industry-standard practices
- **Performance**: Edge computing and optimization
- **Accessibility**: WCAG compliance
- **User Experience**: Intuitive, responsive design

---

**Last Updated**: August 15, 2026  
**Version**: 1.0.0
# Force rebuild
