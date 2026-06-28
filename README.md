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

## Supabase table

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
