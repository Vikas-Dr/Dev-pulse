FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
# Skip postinstall (prisma generate) — schema not copied yet
RUN npm ci --ignore-scripts

COPY prisma/ ./prisma/
# Now generate Prisma client with schema available
RUN npx prisma generate

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build


FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json* ./
# Skip postinstall in production stage too
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/index.js"]
