# Legal and regulatory notes

Hyllvy operates in the EU/Sweden, which shapes several design decisions below.
This file summarizes them for contributors and reviewers; see the build
brief (`docs/build-brief.md`, Section 5) for the original reasoning.

## GDPR

Location data (store check-ins) and macro/health-adjacent logs are personal
data. Design decisions driven by this:

- **Data minimization**: the server resolves a user's GPS to the nearest
  known store and stores only that match - raw GPS trails or a location
  history are never retained.
- **Lawful basis + privacy notice**: a plain-language privacy notice is
  required even at MVP stage, before any real user data is collected.
- **Right to view/export/delete**: account deletion must cascade to a user's
  own observations, or anonymize them (drop `observed_by_user_id`) rather
  than silently orphaning rows.
- **No location history feature**: do not build a "places you've shopped
  over time" view. That crosses from low-risk store-matching into a
  GDPR-heavy feature and is out of scope.

## EU Food Information to Consumers Regulation (1169/2011)

Nutrition data shown in the app is informational, not an authoritative
label. The UI must:

- Clearly label the data source (Open Food Facts / user-submitted).
- Display a persistent disclaimer, especially for allergens: always check
  the physical packaging.

This is implemented as the data-trust badge on product cards, not just a
line in a terms-of-service page nobody reads.

## Database rights (EU sui generis database right) and retailer Terms of Service

Systematically extracting a substantial part of a retailer's structured
product database - even from public pages - carries real legal risk
distinct from copyright. This is why:

- **Scraping Willys/ICA/Lidl (or any retailer) is out of scope and must not
  be implemented.** The `PriceProvider` interface (`apps/backend/src/modules/pricing`)
  exists so a scraper-backed or official-API-backed provider could be added
  later as a peer implementation, but no such provider ships in this repo.
- Crowdsourced user observations (`CrowdsourcedPriceProvider`) don't have
  this problem - that data originates from the user's own purchase, not
  from extracting the retailer's database.

## Trademark

Referring to "Willys", "ICA", "Lidl", etc. by name (nominative use, e.g. "a
price observed at a Willys location") is fine. Do not use their logos,
brand colors, or any language implying affiliation, partnership, or
endorsement.
