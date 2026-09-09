# Infrastructure as code

TODO(DevOps - user): this is a placeholder for learning Terraform (or an
equivalent IaC tool) - no actual Terraform exists yet. This describes what
resources production would need, so you have a checklist to work from.

## Resources needed

- **Compute** for the backend API process (Section 4's modular monolith) -
  a container platform (e.g. ECS Fargate, Cloud Run, or a plain VM group
  behind a load balancer) that can run the image from
  `apps/backend/Dockerfile`.
- **Compute for async job workers** - BullMQ workers (Open Food Facts sync
  jobs, Section 4) should run as a separate deployable from the API process,
  so a slow/failing job never blocks request handling. Same container image,
  different entrypoint/command and scaling policy.
- **Managed Postgres** - source of truth (Section 4). Needs automated
  backups and, eventually, a read replica if the pricing/ingestion module
  gets split out and starts putting real load on the primary.
- **Managed Redis** - cache in front of Postgres for hot barcode lookups,
  and the BullMQ job queue's backing store.
- **Networking** - private networking between the API/worker compute and
  the databases (not exposed to the public internet), plus a public
  load balancer / API gateway in front of the API only.

## Suggested next steps

1. Start with a single Terraform module per resource type above (compute,
   database, cache, networking) rather than one large monolith module.
2. Keep staging and production as separate Terraform workspaces/state files
   from the start - retrofitting that split later is painful.
3. Look at whether your cloud provider's Postgres/Redis offerings (e.g. AWS
   RDS + ElastiCache, GCP Cloud SQL + Memorystore) have first-class Terraform
   providers before hand-rolling anything.
