# Knowledge Bridge Africa

Bridging indigenous wisdom and modern research across the continent.

Knowledge Bridge Africa is a web platform where students, researchers, community elders, and institutions can collect, contribute, review, and share indigenous African knowledge — paired with modern scientific context.

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **React Router** (lazy-loaded routes)
- **Tailwind CSS** + **shadcn/ui** components
- **Framer Motion** animations
- **Supabase** (Auth, Postgres, RLS, RPCs) via `@supabase/supabase-js`
- **Sonner** toasts

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure Supabase by creating a `.env.local` file:

   ```env
   VITE_SUPABASE_URL=https://<your-project>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

5. Preview a production build:

   ```bash
   npm run preview
   ```

## Scripts

| Command                 | Description                            |
| ----------------------- | -------------------------------------- |
| `npm run dev`           | Start the Vite dev server              |
| `npm run build`         | Type-check + production build           |
| `npm run typecheck`     | Run `tsc --noEmit`                      |
| `npm run lint`          | Run ESLint                              |
| `npm run preview`       | Serve the production build locally      |

## Project Structure

```
src/
├── components/            # Pages and feature components
│   ├── admin/             # Admin dashboard module
│   └── ui/                # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx    # Session + profile state
├── hooks/
│   └── usePermission.ts   # Role-based access helpers
├── integrations/
│   └── supabase/
│       └── client.ts      # Supabase client
├── lib/                   # Utilities (search, capabilities, cn)
├── router.tsx             # Route definitions + auth guards
├── App.tsx                # Root layout
└── main.tsx               # Application entry point
```

## Key Routes

| Route                      | Purpose                              |
| -------------------------- | ------------------------------------ |
| `/dashboard`               | Dashboard (Overview doc)             |
| `/dashboard/repository`    | Knowledge repository (CRUD)          |
| `/profile`                 | Sign in / sign up / profile editor   |
| `/admin`                   | Admin module (dashboard, users, ...) |
| `/strategy` … `/reference` | Product documentation pages          |

## Database

The platform expects a Supabase schema built from `supabase/migrations/`. A few things to note:

- Knowledge lifecycle transitions (`submit_knowledge_for_review`, `approve_knowledge`, `reject_knowledge`, `publish_knowledge`) are enforced **server-side** by RPCs and triggers.
- Audit entries are written by **database triggers**, not by the client. Components never write to `audit_logs` directly.
- If the schema is missing these objects, admin surfaces degrade gracefully with an explanatory notice instead of failing hard.

## Testing

See `TESTING.md` for the user-flow smoke test checklist.

## License

N/A — internal project.