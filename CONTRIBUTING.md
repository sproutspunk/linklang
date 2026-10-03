# Contributing to LinkLang

Thank you for your interest in contributing to LinkLang! This guide will help you get set up and understand the conventions we follow so your contribution can be reviewed and merged as smoothly as possible.

---

## Table of Contents

1. [Getting Started Locally](#getting-started-locally)
2. [Development Workflow](#development-workflow)
3. [Code Style](#code-style)
4. [Testing](#testing)
5. [Pull Request Expectations](#pull-request-expectations)
6. [Reporting Issues](#reporting-issues)

---

## Getting Started Locally

### Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later
- **Git**

### Setup

```bash
# 1. Fork the repository and clone your fork
git clone https://github.com/<your-username>/linklang.git
cd linklang

# 2. Install all workspace dependencies
npm install

# 3. Configure environment variables

# Backend — create backend/.dev.vars
#   JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))">
#   RESEND_API_KEY=<your-resend-key>
#   CORS_ORIGIN=http://localhost:5173

# Frontend — create frontend/.env.development
#   VITE_API_URL=http://localhost:8787

# 4. Apply local database migrations
npm run db:migrate:local -w backend

# 5. (Optional) Seed the local database with sample data
npm run db:seed:local -w backend

# 6. Start both frontend and backend in watch mode
npm run dev
```

After step 6 the following services will be available:

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:5173  |
| Backend  | http://localhost:8787  |

---

## Development Workflow

We follow a **feature-branch** workflow:

```bash
# Create a branch from the latest main
git checkout main
git pull origin main
git checkout -b feat/short-description   # or fix/, chore/, docs/, etc.

# Make your changes, then commit with a conventional commit message
git commit -m "feat: add quote currency selector"

# Push and open a PR
git push origin feat/short-description
```

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix    | When to use                                   |
|-----------|-----------------------------------------------|
| `feat:`   | New feature or visible behaviour change       |
| `fix:`    | Bug fix                                       |
| `chore:`  | Build, tooling, or dependency updates         |
| `docs:`   | Documentation only                            |
| `refactor:` | Code restructuring with no behaviour change |
| `style:`  | Formatting, whitespace                        |
| `test:`   | Adding or updating tests                      |

Keep the subject line under 72 characters and written in the imperative mood ("add", "fix", not "added", "fixed").

---

## Code Style

### TypeScript

- **Strict mode** is enabled in both workspaces — avoid `any` unless unavoidable, and always explain why.
- Export types/interfaces separately from implementation files where it improves clarity.
- Use [Zod](https://zod.dev/) for runtime validation on all API inputs and shared schemas.

### Frontend (React)

- One component per file; file name matches the component name (`OrderDetail.tsx`).
- Prefer function components with hooks over class components.
- Keep components focused; move reusable logic into `src/lib/`.
- Use [Zustand](https://zustand-demo.pmnd.rs/) for global client state; local state stays in components.
- Style with [Tailwind CSS](https://tailwindcss.com/) utility classes. Avoid inline `style` props.

### Backend (Hono / Cloudflare Workers)

- Define routes in `backend/src/index.ts`; extract large route groups into dedicated files under `src/`.
- Always validate incoming request bodies with a Zod schema before accessing fields.
- Use [Drizzle ORM](https://orm.drizzle.team/) for all database interactions — no raw SQL strings.
- Keep secrets out of source code; read them from the Cloudflare Workers environment bindings.

### General

- Delete dead code and unused imports rather than commenting them out.
- Keep functions small and single-purpose.
- Favour explicit naming over short abbreviations.

---

## Testing

The project does not yet have an automated test suite. While one is being planned, please validate your changes manually before opening a PR:

1. **Run the type checker** to catch type errors:
   ```bash
   npm run typecheck -w backend
   # Frontend types are checked as part of the build:
   npm run build -w frontend
   ```

2. **Exercise the changed behaviour** end-to-end in the local dev environment (`npm run dev`).

3. **Check the browser console and Wrangler logs** for runtime errors.

Once an automated test infrastructure is added this section will be updated with instructions for running the test suite.

---

## Pull Request Expectations

- **One concern per PR.** Split unrelated changes into separate PRs.
- **Fill out the PR description** explaining *what* changed and *why*.
- **Reference the relevant issue** (e.g. `Closes #42`) if one exists.
- **Keep diffs readable.** Separate formatting/refactoring commits from logic changes where possible.
- All CI checks must pass before a PR can be merged.
- At least one maintainer review is required.
- Be responsive to review feedback. If you disagree with a suggestion, explain your reasoning — discussions are welcome.

---

## Reporting Issues

Before opening an issue, please:

1. **Search existing issues** to check whether it has already been reported or fixed.
2. **Confirm the problem is reproducible** in a fresh environment (clear browser cache, re-run `npm install`, etc.).

When opening a new issue, include:

- A clear, descriptive title.
- Steps to reproduce the problem.
- Expected vs. actual behaviour.
- Your environment (OS, Node version, browser if relevant).
- Relevant logs, screenshots, or screen recordings.

For security vulnerabilities, **do not** open a public issue. Contact the maintainers directly at **hello@linklang.co.uk**.

---

## Code of Conduct

All contributors are expected to follow the project's [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before participating.

---

Thank you for contributing! If you have any questions, feel free to open a discussion or reach out at **hello@linklang.co.uk**.
