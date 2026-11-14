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
COPY --from=prod-deps --chown=node:node /app/package*.json ./
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
RUN mkdir -p /app/uploads/resumes && chown -R node:node /app/uploads
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/src/main"]