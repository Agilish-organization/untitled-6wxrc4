# Lead Search MVP — 5-Lead Free Prototype

Single-page web app for ICP → lead search. No auth, no accounts, no persistence.

## Stack
- **Backend:** Express + Postgres (pg)
- **Frontend:** Single HTML page with vanilla JS (served from `public/`)
- **Enrichment:** Hunter.io + Clearbit (free tiers, wired but optional — seed data fallback)

## Quickstart
```bash
cp .env.example .env
# Edit .env with your Postgres URL
npm install
node db/seed.js  # populate sample leads
npm start        # http://localhost:3000
```

## Conventions
- `server.js` — entry point, ≤300 lines, mounts routers + static
- `routes/*.js` — Express.Router() per endpoint group
- `db/index.js` — ONLY file that calls `new Pool()`
- `db/*.js` — SQL queries per entity
- `migrations/*.sql` — all DDL (never inline in runtime files)
- `public/` — static frontend assets
