---
name: roi-publish-playbook
description: "Use when: preview on other devices, expose localhost safely, deploy Next.js + Supabase quickly, avoid GitHub Pages pitfalls with auth/middleware, and run production checklist for ROI dashboard. Keywords: publish, public url, share link, other device, github pages, vercel, tunnel, deployment"
---

# ROI Publish Playbook

## When to use
- You need to check UI from phone/other PC.
- You want a temporary public URL from localhost.
- You want to deploy this Next.js + Supabase app with minimum effort.
- You are considering GitHub Pages and need to know tradeoffs.

## 1) Quick preview from other devices (same network)
Run local dev server:

```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Find your machine IP and open from another device:

```bash
hostname -I
```

Open:

```text
http://<YOUR_LOCAL_IP>:3000
```

## 2) Temporary public URL (outside your network)
Use one of these tools:
- Cloudflare Tunnel (`cloudflared`)
- ngrok

Example (cloudflared):

```bash
cloudflared tunnel --url http://localhost:3000
```

Copy generated `https://...trycloudflare.com` URL.

## 3) Production deploy (recommended: Vercel)
Why:
- Works naturally with Next.js App Router, middleware, and auth callback routes.
- Minimal setup for Supabase.

Steps:
1. Push repository to GitHub.
2. Import repo in Vercel.
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_PROJECT_REF`
4. Deploy.
5. Update Supabase Auth URLs:
   - Site URL = your Vercel URL
   - Redirect URL = `<VERCEL_URL>/auth/callback`

## 4) GitHub Pages note (important)
This app currently uses middleware/auth callback and dynamic routes.
GitHub Pages is static hosting, so full auth/server behavior is not a good fit.

If GitHub Pages must be used:
- You need static export architecture (`output: export`) and remove server-dependent features.
- Supabase auth flow and middleware constraints require redesign.

## 5) Post-deploy smoke test
1. Open `/login`.
2. Login works.
3. Redirect to `/dashboard` works.
4. Data mode badge shows `Live Data` (or expected mode).
5. Ranking + chart render correctly.

## 6) Security reminders
- Never commit real `.env.local`.
- If a secret key leaks, rotate immediately in Supabase.
- Use service role key only on server-side contexts.
