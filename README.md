# CampaignFlow

A CRM and production-tracking web app for a political-campaign video agency — built as a
student consulting engagement with a real client, and published here with the client's
details removed and demo data in place.

The agency was tracking clients, shoot dates, video revisions, and invoices across
spreadsheets and messages. Nothing connected: no one could answer "which candidates are
waiting on an edit?" or "what are we owed this month?" without manual reconstruction.
CampaignFlow models that whole workflow in one place.

## What it does

**Client pipeline** — a drag-and-drop Kanban board with five stages (Lead Acquisition →
Active Pitch → Contract Review → Onboarded → Delivered). Cards show party affiliation,
constituency, active video count, and next deadline; moving a card updates the client
record and every view that derives from it.

**Production tracking** — projects group videos, and each video moves through a six-state
workflow (pre-production → shooting → editing → review → approved → delivered). Video
feedback is modelled as timestamped comments with priority levels (critical / important /
nice-to-have), so "fix the audio at 0:42" is a first-class record rather than a chat message.

**Finance** — invoices with a full lifecycle (draft / pending / sent / overdue / paid).
Total revenue, outstanding balance, and overdue amounts are derived from invoice state
rather than stored, so the numbers can't drift out of sync.

**Analytics** — pipeline distribution, project status breakdown, conversion trend, and
per-stage production turnaround.

**Scheduling** — shoots, review meetings, and edit deadlines on a shared calendar.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript, Vite |
| Routing | React Router 6 (9 routes) |
| State | Zustand store as single source of truth |
| Forms | react-hook-form + Zod schema validation |
| UI | Tailwind CSS + shadcn/ui (Radix primitives) |
| Charts | Recharts |
| Data layer | Supabase client wired; currently seeded from in-memory demo data |
| Testing | Vitest + Testing Library |

## Architecture notes

The data layer is the part I owned, and [`src/types/crm.types.ts`](src/types/crm.types.ts)
is the file worth reading first. The domain is
modelled first — user roles, pipeline stages, the video status machine, comment priorities,
the invoice lifecycle, activity-timeline event types — and the UI is built against those
types. Statuses are union types rather than free-form strings, so an invalid state fails at
compile time instead of surfacing as a bug in a dashboard.

State lives in a single Zustand store ([`src/store/crmStore.ts`](src/store/crmStore.ts)).
Pipeline, project, finance, and analytics views all read from it and derive their own
figures, which is why a drag-and-drop stage change immediately updates the KPI cards and
charts without any explicit refresh wiring.

## Project status — read this before judging the code

This is a **working front-end prototype**, not a deployed product:

- Data is seeded from `src/data/mockData.ts` and held in memory. The Supabase client is
  configured but no schema is provisioned, so nothing persists across a refresh.
- Some analytics figures (conversion trend, average turnaround) are hardcoded demo values.
- Test infrastructure is configured but coverage is essentially a placeholder.
- Auth types exist in the domain model; no authentication flow is implemented.

The initial application shell was scaffolded with [Lovable](https://lovable.dev), an AI app
builder. Everything below was written and reviewed by hand on top of that scaffold.

## Who built what

This was a two-person build for a student consulting engagement.

**Me ([@chikachan37](https://github.com/chikachan37)) — data model and data layer**

- `src/types/crm.types.ts` — the full domain model: entities and their relationships, user
  roles, the video production state machine, comment priority levels, the invoice lifecycle,
  and activity-event types. Statuses are union types, so invalid states fail at compile time.
- `src/store/crmStore.ts` — the Zustand store and its mutation logic: client CRUD, pipeline
  stage transitions with timestamping, and the cascading updates that keep derived counts
  consistent when a project is added.
- `src/integrations/supabase/` — client wiring and generated types for the intended
  Postgres backend.

**[Shahriyar Ahmed Mahir](https://github.com/mahirvisoredbroom855) — interface and views**

- The nine routed pages, the Kanban pipeline board and its drag-and-drop interactions, the
  dialog components, and the finance and analytics dashboards built on Recharts.

## Running it

```sh
npm install
npm run dev
```

The app runs entirely on demo data — no environment variables or backend needed. To connect
a real Supabase project, copy your credentials into a `.env` file:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
```

## What I'd build next

Picking up where my half of the project stopped:

1. Provision the Postgres schema behind the existing types and replace the mock store with
   real queries, keeping the same store interface so the UI doesn't change.
2. Row-level security per user role — contractors should see assigned videos only, clients
   should see their own projects.
3. Real file upload for video assets, with the comment timestamps anchored to a player.

---

Built as part of the Consulting Engineering Projects program at the University of Toronto
Engineering Strategies and Consulting Association (UTESCA). Published with client
identifiers removed.
