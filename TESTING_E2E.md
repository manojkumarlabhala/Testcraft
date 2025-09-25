E2E testing notes (dev only)

This project includes a small deterministic Playwright test harness to make running E2E locally/CI simpler.

Files of interest:

- tests/e2e/student-elite.spec.ts  — Playwright test (deterministic static DOM variant)
- tests/e2e/playwright.config.ts  — Playwright config (baseURL http://localhost:3001)
- app/test/ai-chat/page.tsx         — Dev-only stable test page (data-testid="ai-chat-widget")
- app/api/test/env-check/route.ts  — Dev-only endpoint that verifies presence of env vars
- app/api/test/mint-session/route.ts — Dev-only mint endpoint (attempts to call Supabase ROPG). NOTE: this currently returns errors in this environment because ROPG appears disabled for the Supabase project.
- app/api/test/echo-supabase/route.ts — Dev-only endpoint that echoes NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (dev only).

How to run locally

1. Start dev server (ensure .env.local contains required vars):

```bash
export PORT=3001
npm run dev
```

2. In another terminal, run Playwright test:

```bash
npx playwright test tests/e2e/student-elite.spec.ts -c tests/e2e/playwright.config.ts --trace=on --reporter=list
```

Notes and caveats

- The `mint-session` route attempts to use ROPG via Supabase `/auth/v1/token`. Many Supabase projects disallow ROPG; in those cases `/api/test/mint-session` will return errors (as seen in this environment). For reliable CI tests that need a logged-in session, prefer generating a server-side session with a service-role key or use service-side helpers to create test users/sessions.

- All `app/api/test/*` routes and `app/test/*` pages are dev-only and return 403 in production (guarded by `process.env.NODE_ENV !== 'production'`). Remove them before deploying or ensure they stay protected.

- The E2E test in this repo uses a deterministic static DOM to validate UI rendering. If you'd like full auth flows tested, I can add a server-side session generator (Requires secure service-role handling) or provide steps to enable ROPG on the Supabase project.
