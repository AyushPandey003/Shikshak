#!/bin/bash
# Local Development Setup Script
# Run this script to set up the local development environment

set -e

echo "🚀 Setting up RAG Platform for local development..."

# Check prerequisites
echo "📦 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required but not installed."
    exit 1
fi

echo "✅ Prerequisites checked"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build shared packages
echo "🔨 Building shared packages..."
pnpm --filter shared build
pnpm --filter prompts build

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual API keys before starting!"
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d qdrant redis azurite

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 5

# Health check
echo "🏥 Checking service health..."

# Check Qdrant
if curl -s http://localhost:6333/healthz > /dev/null; then
    echo "✅ Qdrant is running"
else
    echo "❌ Qdrant failed to start"
fi

# Check Redis
if docker exec -it $(docker ps -q -f name=redis) redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is running"
else
    echo "❌ Redis failed to start"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env with your API keys"
echo "  2. Run 'pnpm dev:api' to start the RAG API"
echo "  3. Run 'pnpm dev:worker' to start the ingestion worker"
echo ""
echo "Services:"
echo "  - RAG API: http://localhost:3001"
echo "  - Qdrant: http://localhost:6333"
echo "  - Redis: localhost:6379"
echo "  - Azurite: localhost:10000"
