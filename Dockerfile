### Multi-stage Dockerfile for Next.js 15 production build
FROM node:20-alpine AS deps
WORKDIR /app
ENV NODE_ENV=production

# Install dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm ci --omit=dev

FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js app
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT 3000

# Copy built files and node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE ${PORT}

# Use a non-root user for security
RUN addgroup -S nextgroup && adduser -S nextuser -G nextgroup
USER nextuser

# Start the Next.js production server
CMD ["npm", "run", "start"]
