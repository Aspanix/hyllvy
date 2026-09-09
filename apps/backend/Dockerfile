# TODO(DevOps - user): finish this Dockerfile as a learning exercise.
#
# This currently only gets the backend running - it isn't tuned for image
# size or build speed. A production version should be multi-stage:
#
#   1. A `deps` stage that installs dependencies (cacheable as long as
#      package*.json don't change).
#   2. A `build` stage that runs `npm run build` (tsc) to produce dist/.
#   3. A slim final stage that copies only dist/ + node_modules (production
#      deps only, via `npm ci --omit=dev`) - not the TypeScript source or
#      devDependencies.
#
# This monorepo uses npm workspaces, so the build context needs the repo
# root (not apps/backend alone) to resolve @hyllvy/shared-types - build with
# `docker build -f apps/backend/Dockerfile .` from the repo root.

FROM node:20-slim

WORKDIR /app

# TODO(DevOps - user): copy only package.json/package-lock.json first so
# this layer is cached across builds that don't change dependencies.
COPY . .

RUN npm install

WORKDIR /app/apps/backend

# TODO(DevOps - user): run `npm run build` and switch CMD to
# `node dist/main.js` once this is a proper multi-stage build.
CMD ["npm", "run", "start:dev"]
