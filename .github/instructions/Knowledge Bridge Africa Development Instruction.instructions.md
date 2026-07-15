# Knowledge Bridge Africa Development Instructions

You are assisting with the Knowledge Bridge Africa project.

## Tech Stack
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- React Router

## Architecture

Always preserve:

- Clean folder structure
- Reusable components
- Type safety
- Mobile-first responsive design
- Accessibility
- Performance

## Authentication

Use only one Supabase client.

Never create duplicate clients.

Authentication must always use the existing AuthContext.

## Routing

After login:

If the user has not completed onboarding:
→ Redirect to Complete Profile.

Otherwise:
→ Redirect directly to the dashboard for the user's role.

Never redirect authenticated users to the Profile page automatically.

## User Roles

Student
Researcher
Community Elder
Government
NGO
Reviewer
Admin

Each role must have its own dashboard.

## Coding Rules

Never delete existing functionality unless instructed.

Before making changes:
- Explain the plan.
- List the files to modify.

After changes:
- Explain what changed.
- Report any risks.
- Suggest tests.

Never fabricate database tables.

Always inspect the existing Supabase schema before writing queries.

Preserve compatibility with existing components whenever possible.