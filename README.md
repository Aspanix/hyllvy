# Hyllvy

*"Hylla"* is Swedish for shelf. Hyllvy is a grocery macro & price scanner for
Sweden: hold your phone up near a shelf, and it detects barcodes live,
showing nutrition (protein/carbs/fat/calories), price where known, and a
cost-effectiveness score (e.g. kr per gram of protein) for each product -
without scanning one item at a time.

Built for gym-goers and macro-conscious shoppers in Sweden, with an eye
toward expanding to Scandinavia and Europe.

## ⚠️ Data disclaimers

- **Nutrition data is informational**, sourced from [Open Food Facts](https://world.openfoodfacts.org/)
  and user submissions - it is not an authoritative label. **Always check
  the physical packaging for allergen information.**
- **Price data is crowdsourced** from users at the point of scanning, not
  from retailers directly. Prices may be stale or incorrect - the app shows
  how recently a price was confirmed.
- See [`LEGAL.md`](./LEGAL.md) for the GDPR, food-labeling, and database-rights
  considerations behind these choices.

## License

This code is public for viewing/evaluation only (e.g. portfolio review).
**All rights reserved - no reuse, modification, or redistribution is
permitted without written permission.** See [`LICENSE.md`](./LICENSE.md).

## Repository layout

This is an npm-workspaces monorepo:

```
apps/
  backend/         @hyllvy/backend  - NestJS modular monolith (API/BFF + domain modules)
  mobile/          @hyllvy/mobile   - Expo/React Native client
packages/
  shared-types/    @hyllvy/shared-types - TypeScript models shared by both apps
docs/
  build-brief.md   - the product/architecture brief this project is built from
```

See `docs/build-brief.md` Section 4 for the full architecture rationale
(modular monolith, domain module boundaries, why Postgres/Redis/BullMQ).

## Tech stack

TypeScript everywhere - NestJS (backend), Expo/React Native (mobile),
Postgres + Redis + BullMQ (planned, not yet wired up), npm workspaces.

## Getting started

```bash
npm install
```

### Backend (`apps/backend`)

```bash
cd apps/backend
npm run typecheck   # tsc --noEmit
npm test            # jest
npm run start:dev   # ts-node src/main.ts
```

### Mobile (`apps/mobile`)

```bash
cd apps/mobile
npm run typecheck
npm test
npx expo start      # scan the QR code with Expo Go, or press i/a for a simulator
```

## Status

Early scaffold - see `docs/build-brief.md` Section 13 for the deliverable
list this project is being built against. Domain modules in the backend are
currently interface-defined stubs (except `cost-effectiveness`, which is
fully implemented); the mobile app's screens run on placeholder data since
there's no GraphQL/BFF layer wired up yet.
