# syntax=docker/dockerfile:1.7
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/config/package.json ./packages/config/package.json
RUN npm install
COPY . .
RUN npm run build --workspace api

FROM node:20-alpine
WORKDIR /app
COPY --from=base /app/apps/api/dist ./dist
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/package-lock.json ./package-lock.json
COPY --from=base /app/node_modules ./node_modules
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
