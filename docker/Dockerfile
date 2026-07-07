# -----------------------------
# Builder stage
# -----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_WS_URL
ARG NEXTAUTH_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build


# -----------------------------
# Runner stage
# -----------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install ONLY production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy build output only
COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY docker/prod-entrypoint.sh ./docker/prod-entrypoint.sh

RUN chmod +x ./docker/prod-entrypoint.sh

EXPOSE 3000

CMD ["./docker/prod-entrypoint.sh"]
