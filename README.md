# Movie Date Invite

A tiny mobile-first date invite site for Ryan to send Enie on Instagram.

Results are delivered by email through Formspree:

```text
https://formspree.io/f/xaqgjarp
```

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Deploy

Deploy the GitHub repository to Vercel. No backend, database, or environment
variables are required for the default setup.

When Enie submits a movie choice, Formspree sends the result to the email
connected to the Formspree form.
