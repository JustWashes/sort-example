# JustWashes Admin — design reference

A working reference implementation of the JustWashes admin panel handed off
from Claude Design. It lives at `admin/project/JustWashes Admin.html` and runs
React + Babel-standalone in the browser, no build step required.

## Run it

Anything that serves a directory works. From the repo root:

```sh
# Python
python3 -m http.server 8000
# or Node
npx serve .
```

Then open `http://localhost:8000/admin/project/JustWashes%20Admin.html`.

## What's in here

- Technician roster + full profile, with quick-glance drawer and a public
  customer-facing profile preview modal.
- Customer roster + full profile with vehicles, billing, renewals, disputes.
- Shared shell (sidebar nav, top bar, sub-bar).

## Conjunctive search, filter, and sort

Both rosters now compose every dimension. Each control is independent and
applied as an AND, so you can stack them freely.

**Search** — free-text across name / email / handle / ZIP / etc.

**Faceted filter chips** — click *Add filter*, pick a facet, then dial it in:
- *Set* facets (Status, Plan tier, Type, BG check, Pay tier, ZIP, City,
  Cadence) — searchable checkbox list.
- *Range* facets (Bookings, Credits, Lifetime spend, Onboarding %, Monthly
  jobs, Lifetime jobs, Rating) — min/max inputs.
- *Date range* facets (Joined date) — from/to plus presets (Last 30d, Last
  90d, YTD, Before 2025).

Empty chips are no-ops, so you can drop one in and configure it without
freezing the table.

**Multi-column sort** — click any sortable header to sort by it; **shift-click
or `+`** on a header to add it as a secondary/tertiary sort. The "Sorted by"
chip strip shows the active order; arrows flip direction, × removes a key.

The user's example use case ("earliest active subscriber") works end-to-end:
click the *Active* tab, add filter *Plan tier ≠ No plan*, sort *Joined ▲* —
top row is the answer.

## Files

- `admin/README.md` — original handoff instructions from the design tool.
- `admin/chats/` — design conversation transcripts.
- `admin/project/` — the prototype.
  - `JustWashes Admin.html` — entrypoint.
  - `app.jsx` — top-level routing.
  - `shell.jsx` — sidebar + top bar.
  - `data.jsx` — mock technicians + customers.
  - `primitives.jsx` — buttons, pills, icons, nav data.
  - `filterbar.jsx` — `applyFilters`, `applySort`, `FacetChip`,
    `AddFacetMenu`, `SortHeader`. The pieces both rosters share.
  - `technician-roster.jsx`, `technician-profile.jsx`
  - `customer-roster.jsx`, `customer-profile.jsx`
  - `quickglance.jsx`, `public-profile.jsx`
  - `tweaks-panel.jsx` — Claude Design tweaks shell.
