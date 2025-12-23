# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared ./packages/shared
COPY apps/ingestion-worker ./apps/ingestion-worker

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared package first
RUN pnpm --filter shared build

# Build the worker
RUN pnpm --filter ingestion-worker build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache \
    ffmpeg \
    python3 \
    py3-pip \
    tesseract-ocr \
    tesseract-ocr-data-eng

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Copy built files
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/apps/ingestion-worker/dist ./apps/ingestion-worker/dist
COPY --from=builder /app/apps/ingestion-worker/package.json ./apps/ingestion-worker/
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Set environment
ENV NODE_ENV=production

# Create temp directory for processing
RUN mkdir -p /tmp/processing && chmod 777 /tmp/processing

# Run the worker
CMD ["node", "apps/ingestion-worker/dist/index.js"]
