# Testcraft Deployment Guide

## Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase project and keys
- Razorpay account and API keys
- GitHub account

## 1. Clone the Repository
```
git clone https://github.com/manojkumarlabhala/Testcraft.git
cd Testcraft
```

## 2. Install Dependencies
```
npm install
```

## 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## 4. Run Tests
```
npm run test
```

## 5. Build for Production
```
npm run build
```

## 6. Start the Server
```
npm run start
```

## 7. Deploy to Vercel (Recommended)
- Push your code to GitHub.
- Import the repo in Vercel dashboard.
- Set environment variables in Vercel project settings.
- Deploy!

## 8. Deploy to a VPS with Coolify (preferred for self-managed deployments)

Coolify is a simple PaaS you can run on your VPS to deploy apps via Docker. This project is compatible with Coolify. Follow these steps to deploy:

1. Prepare your VPS
	- A fresh Ubuntu 22.04 server (or similar) with Docker and Docker Compose installed.
	- A domain name pointed to the VPS IP (A record).

2. Install Coolify on your VPS (follow official docs) or use the one-line installer:
```
# on the VPS
curl -fsSL https://get.coolify.io | bash
```

3. In Coolify, create a new Application
	- Choose 'Docker image' or 'Build from repo' depending on your workflow. For Next.js, choose 'Build from repo' (Git provider) or connect via SSH/Local build.

4. Add build & run commands in Coolify
	- Build command: npm ci && npm run build
	- Run command: npm run start -- if your package.json has a start script that runs `next start -p $PORT`.
	- Set the Dockerfile or environment to `NODE_ENV=production` and `PORT=3000` (or leave PORT blank to have Coolify set it).

5. Configure Secrets (Environment Variables)
	- Create a secret in Coolify named `.env.production` or add each environment variable in the UI. Use the provided `.env.production.example` as the template.
	- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set as a secret and NOT prefixed with `NEXT_PUBLIC_`.

6. Ports & TLS
	- Let Coolify provision TLS via Let's Encrypt automatically for your domain.
	- Ensure the application listens on the internal port Coolify provides (default 3000). Use `process.env.PORT || 3000` in production.

7. Deploy & Verify
	- Trigger a deploy in Coolify and watch the build logs.
	- Verify the site at https://your-domain.example.com
	- Check Supabase connections, payment webhooks, and AI API endpoints.

## 9. Use the `.env.production.example`
1. Copy the example to a real production env file locally (do not commit):
```
cp .env.production.example .env.production
# edit .env.production and fill real values
```
2. Add values in Coolify's environment / secrets using the same keys.

## 10. Troubleshooting & Verification Steps
- Check the Coolify build logs for missing dependencies or build errors.
- Open browser devtools to verify client env variables (NEXT_PUBLIC_* are visible).
- Verify Supabase: run a quick curl to Supabase REST endpoint or log into Supabase console.
- Verify payment flow in test mode first (Razorpay test keys) and switch to live keys after confirmation.
- For webhooks (Razorpay / PhonePe) ensure the callback URL in their dashboards matches `${APP_URL}/api/payments/...` and that Coolify exposes the route publicly.

## 11. DB Migration: create `blog_posts` table

If you're using Supabase/Postgres, run the SQL in `db/migrations/001_create_blog_posts.sql` to create the `blog_posts` table:

1. In Supabase SQL editor, paste the file contents and run.
2. Or run locally using psql:
```bash
# Example (replace connection string):
psql "postgresql://username:password@host:5432/dbname" -f db/migrations/001_create_blog_posts.sql
```

## 12. AI Publisher Worker (example)

We included an example worker script at `scripts/ai-publish-example.js` that demonstrates how an AI agent can:
- generate content (OpenAI example), and
- POST to the server API at `/api/blog/create` using an `API_PUBLISH_KEY`.

How to run the example locally (set env vars in `.env.production` or export in shell):
```bash
export OPENAI_API_KEY=sk_xxx
export API_PUBLISH_KEY=your_publish_key
export APP_URL=http://localhost:3000
node scripts/ai-publish-example.js
```

Recommended Coolify setup for the worker:
1. Add a new background service in Coolify named `ai-publisher`.
2. Use the same repo and select the `scripts/ai-publish-example.js` as the start command: `node scripts/ai-publish-example.js` or build a small Dockerfile for the worker.
3. Add secrets: `OPENAI_API_KEY`, `API_PUBLISH_KEY`, `APP_URL` (pointing to your domain), and other keys.
4. Configure scheduling in Coolify or run as a long-running process that polls a queue / webhook.

## 13. Security Recommendations
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `API_PUBLISH_KEY` in client-side code.
- Use `NEXT_PUBLIC_` prefix only for variables safe to expose to the browser.
- Rotate keys periodically and store them in Coolify's secrets manager.

---
If you want, I can: (1) add a tiny server-side validation for slugs (2) create a dedicated Dockerfile for the worker, or (3) create a Git branch and push these changes. Tell me which next.
---
Update note: numbering bumped to accommodate Coolify instructions. Continue using the rest of the guide for local/dev workflows.

## 8. Manual GitHub Push
```
git add .
git commit -m "Initial production-ready commit"
git push origin main
```

## 9. Troubleshooting
- Ensure all environment variables are set.
- Check build and runtime logs for errors.
- For payment API, verify Razorpay keys and Supabase connection.

---
For more help, see README.md or contact project maintainers.
