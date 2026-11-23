# Shipment AI

React, TypeScript, Tailwind, Supabase (Auth, Postgres, Storage, Edge Functions), Recharts and Leaflet (OpenStreetMap, no API key).

## Run locally
```bash
npm install
cp .env.example .env     # then fill in the two Supabase values
npm run dev
```

## One time Supabase setup (required for sign up, log in and the dashboard)
Fastest path: paste `supabase/reset_and_install.sql` into the SQL editor (it wipes the public schema first, so use it on a new or disposable project). On a clean project `schema.sql` alone is enough.
1. Create a project at supabase.com. Copy **Project URL** and **anon public key** (Settings > API) into `.env`.
2. SQL editor: paste and run `supabase/schema.sql`. It creates all tables, row level security (data isolated per organization), the signup trigger that creates the organization and admin membership, the public tracking function and the private `documents` storage bucket.
3. Authentication > URL Configuration: set **Site URL** to your site address and add `https://YOUR_SITE/reset-password` and `https://YOUR_SITE/login` to **Redirect URLs** (also `http://localhost:5173/**` for development).
4. Authentication > Providers > Email: leave enabled. "Confirm email" may stay on (users get a confirmation link) or be turned off for instant access. For real email volume, set up custom SMTP.

## AI assistant (server side)
```bash
npx supabase login && npx supabase link --project-ref YOUR_REF
npx supabase secrets set ANTHROPIC_API_KEY=your_key      # paid Anthropic API key
npx supabase functions deploy ask-ai
```
The key never reaches the browser. The function forwards the user's JWT, so it only reads that user's organization data.

## REST API and webhooks
```bash
npx supabase functions deploy ingest-shipment --no-verify-jwt
```
Generate an API key on the dashboard Integrations page and POST shipments with the `x-api-key` header.

## Deploy
`npm run build` outputs `dist/`. Host on Netlify or Vercel with a rewrite of all paths to `/index.html` and set the two `VITE_` variables.

## Notes on data
- If the schema was already run, run just the final "Table privileges" block of schema.sql too.
- Prices ($47, $57, $97 per month) were read from the Selar pages. Selar does not publish plan benefits, so feature lists in `src/lib/config.ts` describe capabilities only and state no limits. Edit them there.
- "Load demonstration data" inserts clearly flagged sample rows. No live carrier tracking exists until you connect a carrier or tracking provider.
- Analytics sections for trends, dwell time and regions are labelled demonstration data; cost analysis needs imported cost data.
- The logo is a temporary mark in `src/components/Logo.tsx` and `public/favicon.svg`.
