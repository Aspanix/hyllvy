# Build brief: Hyllvy — grocery macro & price scanner (Sweden/Scandinavia MVP)

**Project name: Hyllvy** (from Swedish "hylla" = shelf). Use this consistently as the
GitHub repository name (`hyllvy`), the root package/monorepo name, the mobile app display
name, and the npm/package scope where relevant (e.g. `@hyllvy/shared-types`).

This document is a build brief for Claude Code. Read it fully before writing any code.
It defines scope, architecture, legal constraints, coding standards, repo/git workflow,
and DevOps handoff points. Where something is marked `TODO(DevOps — user)`, scaffold it
with structure and comments, but leave the actual implementation for the project owner
to complete themselves as a learning exercise — do not fully implement those pieces.

## 1. Product summary

A mobile app for grocery shopping in Sweden that helps users hit daily macro targets
cost-effectively. Core loop: user holds their phone up near a shelf, the camera detects
barcodes live, and the app shows nutrition (protein/carbs/fat/calories), price (where
known), and a cost-effectiveness score (e.g. kr per gram of protein) for each product —
without the user manually scanning one item at a time.

Target users: gym-goers and macro-conscious shoppers in Sweden, expanding to Scandinavia
and Europe if successful.

## 2. MVP scope — explicitly in

- **Live multi-barcode detection** via on-device camera (not one-at-a-time manual scan).
  On-screen overlay labels appear next to each barcode the camera can resolve.
- **Small EU barcode handling**: Swedish/EU EAN-13 barcodes are often printed smaller
  than US UPC codes. Design the scan UX around a realistic working distance of roughly
  10–40cm, not full-aisle-width. When a barcode is detected but not yet decodable
  (too small/blurry at current distance), show a "move closer" state rather than
  failing silently. Support tap-to-focus and use telephoto lens when available.
- **Nutrition lookup** via Open Food Facts (free, open, barcode-keyed, decent EU/Nordic
  coverage). Always label this as the data source in the UI.
- **Full macro profile**: users set daily targets for protein/carbs/fat/calories (not
  just a single protein number). A running tally updates as products are added to a
  "shopping session" while scanning.
- **Store-level crowdsourced pricing**: GPS matches the user to a known store location
  (chain + address, e.g. a specific Willys). When a user scans a product, they can
  confirm/enter the price they see; this is stored as `(store, product, price, timestamp,
  observed_by)`. Other users at the same store later see these prices, with a clear
  "last confirmed N days ago" staleness indicator and a light prompt to reconfirm stale
  prices. This is the app's primary pricing data source for MVP — there is no official
  retailer API.
- **Cost-effectiveness scoring**: server-side calculation (e.g. price per gram of protein)
  so the algorithm can improve without app store releases.

## 3. Explicitly out of scope for MVP (do not build; leave extension points)

- Full visual product recognition without barcodes (shelf-wide image recognition). This
  needs custom-trained models per retailer packaging and is a phase-2+ effort.
- Aisle/shelf-level indoor positioning or prediction ("this exact shelf usually has X").
  Not feasible with consumer GPS; only store-level location is reliable.
- Scraping retailer websites (Willys/ICA/Lidl) for prices, campaigns, or availability.
  See Section 5 (Legal) for why. Design the `PriceProvider` interface (Section 4) so a
  scraper-backed provider could be added later without changing calling code, but do
  not implement one now.

## 4. Architecture

Modular monolith backend (not microservices for MVP — see rationale below), TypeScript
end-to-end, mobile client in Expo/React Native.

**Why modular monolith, not microservices**: a single small team building an MVP gets no
benefit from network hops and distributed deployment overhead yet. Instead, enforce strict
module boundaries now (below) so that if/when a specific module needs independent scaling
(pricing/ingestion is the most likely candidate), it can be extracted into its own service
without a rewrite — only the transport layer changes, not the module's internal design.

**Layers**:
- **Client (Expo/React Native)**: offline-first local cache (SQLite via WatermelonDB or
  Expo SQLite) for recently scanned products and macro state. On-device multi-barcode
  detection (ML Kit on Android / Vision framework on iOS via Expo's camera/barcode APIs)
  — barcode detection happens on-device, never by streaming video to a server. Client is
  thin: no business logic (e.g. cost-effectiveness scoring) lives here, only display and
  local caching.
- **API / BFF layer**: single entry point (GraphQL preferred — client wants to fetch
  "product + nutrition + price + cost-effectiveness" as one shaped query per barcode).
  Handles auth, request validation, rate limiting.
- **Domain modules** (folders with enforced boundaries — no direct cross-module DB access,
  only through each module's public interface):
  - `product-nutrition`: normalizes/caches Open Food Facts data by barcode.
  - `pricing`: implements a `PriceProvider` interface. MVP ships one concrete provider —
    `CrowdsourcedPriceProvider` (store-level observations, per Section 2). Interface is
    designed so a future `ScraperPriceProvider` or official retailer API provider could
    be added later as a peer implementation.
  - `user-macro`: user profiles, daily macro targets, shopping session / running tally.
  - `cost-effectiveness`: pure, stateless calculation logic combining nutrition + price.
    Easy to unit test in isolation; a good first candidate to extract into its own
    package even before it's a separate service.
- **Async backbone**: job queue (Redis + BullMQ) runs scheduled Open Food Facts sync jobs,
  decoupled from the request path, so a flaky external dependency never causes a user-
  facing failure — the API always reads from the local cache/DB.
- **Data stores**: Postgres as source of truth (include a `region` column on
  product/price-related tables from day one — cheap now, saves a painful migration when
  expanding beyond Sweden). Redis as a cache in front of Postgres for hot lookups
  (barcode → product + price).

**Suggested stack**: TypeScript everywhere (shared types for Product/Price/Macro models
between client and backend), NestJS for the backend (its module system maps directly onto
the bounded contexts above), Postgres, Redis, BullMQ, Expo/React Native for the client.

## 5. Legal and regulatory considerations (EU/Sweden) — bake these in, don't bolt on later

Flag clearly in code comments and README where each of these is addressed. Claude, add a
`LEGAL.md` file summarizing these for future contributors/reviewers.

- **GDPR**: location data (store check-ins) and macro/health-adjacent logs are personal
  data. Requirements to design in from the start:
  - Data minimization: store only what's needed to match a user to a known store location
    (e.g. resolve GPS to nearest known store server-side, don't retain raw GPS trails or
    location history beyond that).
  - Lawful basis + a plain-language privacy notice, even at MVP stage.
  - User ability to view/export/delete their own data (account deletion should cascade
    to their observations, or anonymize them rather than silently orphaning rows).
  - Do not build a "location history" or "places you've shopped over time" feature without
    treating it as sensitive — it's exactly the kind of feature that turns a low-risk app
    into a GDPR-heavy one.
- **EU Food Information to Consumers Regulation (1169/2011)**: nutrition data shown must
  be clearly labeled as informational and sourced from Open Food Facts / user-submitted
  data, not an authoritative label — display a persistent disclaimer, especially around
  allergens ("always check the physical packaging for allergen information").
- **Database rights (EU sui generis database right) and site Terms of Service**: this is
  why retailer scraping is out of scope for MVP (Section 3) — systematically extracting a
  substantial part of a retailer's structured product database, even from public pages,
  carries real legal risk distinct from copyright. Crowdsourced user observations (users
  recording their own purchases/prices) don't have this problem — that data originates
  from the user, not extracted from the retailer's database.
- **Trademark**: referring to "Willys", "ICA", "Lidl" as store names (nominative use) is
  fine; do not use their logos, brand colors, or any language implying affiliation,
  partnership, or endorsement.

## 6. Data model (starting sketch — Claude Code should refine field types/indexes)

- `User` — id, email, created_at
- `MacroProfile` — user_id, daily_protein_g, daily_carbs_g, daily_fat_g, daily_calories
- `ShoppingSession` — id, user_id, store_id, started_at, ended_at
- `SessionItem` — session_id, product_id, quantity, added_at (feeds the running tally)
- `Product` — id, barcode (unique), name, brand, off_id (Open Food Facts reference)
- `NutritionFact` — product_id, protein_g, carbs_g, fat_g, calories, per_quantity, unit
- `Store` — id, chain (enum: willys/ica/lidl/other), name, address, lat, lng, region
- `ProductObservation` — store_id, product_id, price, currency, observed_by_user_id,
  observed_at, confidence (nullable, for future use)

## 7. DevOps — scaffold with hints, don't fully implement

The project owner is learning DevOps and wants to complete these pieces themselves.
For each item below: create the file/folder structure and add clear comments explaining
what needs to go there and why, but leave the actual configuration/scripts as a guided
`TODO(DevOps — user)` rather than a finished solution.

- `TODO(DevOps — user)`: **CI pipeline** — GitHub Actions workflow that lints, type-checks,
  and runs tests on every PR. Scaffold `.github/workflows/ci.yml` with a skeleton and
  comments on what jobs to add (install, lint, typecheck, test, build).
- `TODO(DevOps — user)`: **Containerization** — `Dockerfile` for the backend and a
  `docker-compose.yml` for local dev (Postgres + Redis + backend). Scaffold with comments;
  leave final tuning (multi-stage build, image size optimization) as an exercise.
- `TODO(DevOps — user)`: **Environment/secrets management** — `.env.example` with all
  required variables documented, and a comment pointing to where a secrets manager
  (e.g. GitHub Actions secrets, or a cloud provider's secret store) would plug in for
  deployment.
- `TODO(DevOps — user)`: **Infrastructure as code** — a `/infra` folder with a short
  README describing what Terraform (or equivalent) resources would be needed (compute,
  managed Postgres, managed Redis, networking) — no actual Terraform required yet.
- `TODO(DevOps — user)`: **Deployment strategy** — comments/README section outlining a
  staging vs. production split and how the async job workers would be deployed
  separately from the API process.
- `TODO(DevOps — user)`: **Observability** — note where structured logging and basic
  metrics/tracing (e.g. OpenTelemetry) would be wired in; don't fully implement.

## 8. Coding standards

- TypeScript strict mode across client and backend.
- Follow SOLID principles — module boundaries in Section 4 should reflect single
  responsibility per module; depend on interfaces (e.g. `PriceProvider`) not concrete
  implementations where a module has a plausible future alternative.
- Meaningful naming (no abbreviations that aren't obvious), small focused functions.
- Comments should explain *why*, not restate *what* the code does — especially around
  the legal/compliance-sensitive areas in Section 5 (flag those in code comments so a
  reviewer can find them quickly).
- Enforce style with ESLint + Prettier, configured in the repo from the first commit.
- Unit tests for the `cost-effectiveness` module (pure logic, easiest to test well) and
  the `pricing` module's provider interface.

## 9. Repository and git workflow

- Repository name: `hyllvy`. Public on the project owner's personal GitHub account —
  visible for portfolio/hiring purposes, not licensed for reuse (see Section 10).
- **Branching**: trunk-based with short-lived feature branches, named
  `feature/<short-description>`, `fix/<short-description>`, `chore/<short-description>`.
- **GitHub Issues**: one issue per feature/task (reference the features in Section 2 as
  a starting issue list). Branches and PRs reference their issue (e.g. `Closes #12`).
- **Commits**: atomic — one logical change per commit, not multi-file feature dumps.
  Use Conventional Commits style (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`,
  `chore:`). Commit progressively as work happens, not as one large commit at the end —
  this should read as an actively developed project, not a single squashed drop.
- **PRs**: open a PR per feature branch, include a description referencing the issue,
  merge into main only after tests pass. Do not commit directly to main.
- Set up a basic PR template (`.github/PULL_REQUEST_TEMPLATE.md`) and issue templates.
- **GitHub access**: the project owner authenticates locally via `gh auth login` (GitHub
  CLI) before work begins. Claude Code should use `gh` for all repo-level operations —
  creating the repository itself, creating branches, pushing, and opening PRs.
- **Review gate — mandatory**: work one issue/feature at a time. After implementing a
  feature, committing progressively (per the atomic-commit rules above), pushing the
  branch, and opening its PR, **stop and wait for the project owner's explicit review
  and approval before merging into main**. Never auto-merge a PR. Never proceed to the
  next feature/issue until the current one has been explicitly approved or feedback has
  been given and addressed.

## 10. Licensing

Add a `LICENSE.md` (not a standard OSI license) stating explicitly: all rights reserved;
the code is public for viewing/evaluation purposes (e.g. portfolio review by potential
employers); no permission is granted to use, copy, modify, merge, publish, distribute,
sublicense, or sell copies of the software, in whole or in part, without prior written
permission from the copyright holder. Reference this plainly in the README as well, so
it's not just buried in a license file.

## 11. First deliverables for Claude Code

1. Create the GitHub repository as `hyllvy` and scaffold the monorepo structure
   (`/apps/mobile`, `/apps/backend`, `/packages/shared-types`), using the `hyllvy` /
   `@hyllvy/*` naming convention for the root package and workspace packages.
2. Set up backend module skeletons per Section 4 with interfaces defined (even if
   implementations are stubs initially).
3. Set up the Expo app skeleton with camera/barcode detection wired to a placeholder
   overlay UI.
4. Add `LEGAL.md`, `LICENSE.md`, `README.md` (with the Hyllvy name/tagline, and
   disclaimers from Section 5 and 10).
5. Add DevOps scaffolding per Section 7 with `TODO(DevOps — user)` markers.
6. Create the initial GitHub Issues list mirroring Section 2's feature list, sized as
   individually mergeable pieces of work.
