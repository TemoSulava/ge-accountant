# syntax=docker/dockerfile:1.7
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/config/package.json ./packages/config/package.json
RUN npm install
COPY . .
RUN npm run build --workspace web

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/apps/web/dist ./dist
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "5173"]
