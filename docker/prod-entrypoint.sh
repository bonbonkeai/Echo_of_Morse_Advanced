#!/bin/sh
set -eu

echo "[prod-entrypoint] Applying database migrations..."
until node node_modules/prisma/build/index.js migrate deploy; do
  echo "[prod-entrypoint] Database is not ready yet; retrying in 2s..."
  sleep 2
done

echo "[prod-entrypoint] Seeding database when needed..."
node prisma/seed.js

echo "[prod-entrypoint] Starting Next.js..."
exec npm run start
