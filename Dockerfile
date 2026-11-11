# ЭТАП 1: сборка (здесь есть все зависимости, включая prisma CLI)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# ЭТАП 2: оставляем только prod-зависимости
FROM builder AS prod-deps
RUN npm prune --omit=dev

# ЭТАП 3: запуск
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /app/package*.json ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/src/main"]