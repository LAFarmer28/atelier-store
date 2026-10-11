# Atelier Store

Next.js eCommerce app built with TypeScript, Tailwind CSS, Better Auth, Drizzle ORM, and Neon Postgres.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000.

## Environment

| Variable              | Purpose                                      |
| --------------------- | -------------------------------------------- |
| `DATABASE_URL`        | Neon Postgres connection string              |
| `BETTER_AUTH_SECRET`  | Secret for signing sessions (`npx auth secret`) |
| `BETTER_AUTH_URL`     | Server base URL for Better Auth              |
| `NEXT_PUBLIC_APP_URL` | Base URL used by the browser auth client     |

## Project structure

```
src/
  app/
    api/auth/[...all]/route.ts  Better Auth route handler
    layout.tsx, page.tsx        App shell
  db/
    index.ts                    Drizzle client (Neon HTTP driver)
    schema.ts                   Drizzle schema
  lib/
    auth.ts                     Better Auth server instance
    auth-client.ts              Better Auth React client
drizzle.config.ts               drizzle-kit config
```

## Scripts

| Script                  | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| `npm run dev`           | Start the dev server                                 |
| `npm run build`         | Production build                                     |
| `npm run lint`          | ESLint                                               |
| `npm run typecheck`     | TypeScript check                                     |
| `npm run auth:generate` | Generate Better Auth tables into `src/db/schema.ts`  |
| `npm run db:generate`   | Generate SQL migrations from the schema              |
| `npm run db:migrate`    | Apply migrations                                     |
| `npm run db:push`       | Push the schema directly (prototyping)               |
| `npm run db:studio`     | Open Drizzle Studio                                  |

## Database setup

1. Create a Neon project and copy the pooled connection string into `DATABASE_URL`.
2. `npm run auth:generate` to add the Better Auth tables to the schema.
3. `npm run db:generate && npm run db:migrate` to create them in Neon.
