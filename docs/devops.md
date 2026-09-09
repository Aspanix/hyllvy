# DevOps notes

TODO(DevOps - user): this covers the two Section 7 items that don't have
their own config file (deployment strategy and observability) - both are
notes to guide your own implementation, not finished setups.

## Deployment strategy

- **Staging vs. production**: run two separate environments from day one -
  even a minimal staging environment catches "works on my machine" issues
  before they hit real users. Separate databases, separate `.env`s, ideally
  separate cloud accounts/projects so a staging mistake can't touch
  production data.
- **API vs. async workers**: the backend's HTTP API process and its BullMQ
  job workers (Open Food Facts sync jobs, Section 4) should deploy as two
  separate units, not one process doing both. This lets you scale or
  restart them independently - a stuck sync job shouldn't be able to starve
  the API of resources, and redeploying the API shouldn't interrupt
  in-flight jobs.
- Once `apps/backend/Dockerfile` is finished (see the TODOs in that file),
  the API and worker deployments would use the same image with a different
  command (`node dist/main.js` vs. a worker entrypoint that doesn't exist
  yet).

## Observability

Nothing is wired up yet - these are the two things to add first, and where:

- **Structured logging**: replace `console.log` (there isn't any yet, but
  it'll be tempting) with a structured logger (e.g. `pino` or NestJS's
  built-in `Logger`) from the start, so logs are queryable once they reach
  a real log aggregator. Wire it in at `apps/backend/src/main.ts`
  (`NestFactory.create` accepts a custom logger).
- **Metrics/tracing**: OpenTelemetry is the natural fit given NestJS's
  interceptor/middleware system - an interceptor at the `AppModule` level
  is the right place to add request-level tracing once this matters (i.e.
  once there's a real data layer and external calls worth tracing, not
  before).
