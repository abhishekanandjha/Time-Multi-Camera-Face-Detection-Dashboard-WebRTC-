#!/bin/sh
# Wait for postgres then run migrations and start
set -e

# run prisma migrations (will create DB schema)
npx prisma migrate deploy || true

exec "$@"