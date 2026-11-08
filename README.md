# agentteam – Task Management Dashboard

A foundation for a task management dashboard built with **Next.js (App Router)**, **TypeScript** and **Tailwind CSS v4**. It uses local mock data only: no database, authentication or AI agents yet.

## Prerequisites

- Node.js 20.9 or newer
- npm

## Setup

```bash
npm install
```

## Run

```bash
npm run dev        # development server at http://localhost:3000
npm run lint       # ESLint
npm run typecheck  # TypeScript check
npm run build      # production build
npm run start      # serve the production build (run build first)
```

## Project structure

```
src/
  app/
    layout.tsx        Root layout (wraps pages in AppShell)
    page.tsx          Dashboard: status stats and active task cards
    tasks/page.tsx    All tasks
    globals.css       Tailwind import and base styles
  components/         Reusable UI: AppShell, Sidebar, TaskCard, TaskGrid,
                      StatCard, Badge, PageHeader, navItems
  data/tasks.ts       Mock task data
  lib/tasks.ts        Labels and helpers (counts, date formatting)
  types/task.ts       Task types
```

## Notes

- The sidebar is fixed on desktop and slides in via a "Menu" button on small screens.
- To add a page, create `src/app/<name>/page.tsx` and add an entry to `src/components/navItems.ts`.
- Replace `src/data/tasks.ts` with a real data source when a backend is added.
