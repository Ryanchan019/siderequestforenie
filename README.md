# Movie Date Invite

A tiny mobile-first date invite site for Ryan to send Enie on Instagram.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Admin

Set `ADMIN_PASSWORD` in `.env.local`, then open:

```text
http://localhost:3000/admin?password=YOUR_PASSWORD
```

If `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are not set, local development writes responses to `/tmp/movie-date-responses.json`.

## No-backend result delivery

The simplest production setup is to use a form inbox service such as Formspree:

1. Create a Formspree form.
2. Copy its endpoint, usually like `https://formspree.io/f/xxxxxxx`.
3. Set this environment variable on Vercel:

```text
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxx
```

When this variable is set, the movie choice is sent directly from the browser to Formspree, and Ryan receives the result by email. No Supabase table or custom backend is required.

## Optional Supabase table

Use this only if you want the private `/admin` results page backed by a database.

Create a table named `responses`:

```sql
create table responses (
  id uuid primary key default gen_random_uuid(),
  movie text not null,
  note text,
  user_agent text,
  created_at timestamptz not null default now()
);
```

On Vercel, set:

- `ADMIN_PASSWORD`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Then deploy the project to Vercel and send the public URL to Enie.
