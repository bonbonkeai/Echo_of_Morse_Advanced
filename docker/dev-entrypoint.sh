#!/bin/sh

echo "Waiting DB..."

npx prisma generate
npx prisma migrate deploy
npx prisma db seed

echo "Starting dev server..."

npm run dev