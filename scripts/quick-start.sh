#!/bin/bash

# FuMu Quick Start Script
# This script quickly sets up FuMu for development

set -e

echo "🎬 FuMu Quick Start Script"
echo "=========================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the FuMu root directory"
    exit 1
fi

print_status "Starting FuMu quick setup..."

# Step 1: Install dependencies
print_status "Installing dependencies..."
pnpm install

# Step 2: Setup environment
print_status "Setting up environment..."
if [ ! -f ".env" ]; then
    cp env.example .env
    print_warning "Created .env file from template. Please update with your API keys."
fi

# Step 3: Setup database (if Docker is available)
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    print_status "Setting up database with Docker..."
    
    # Start PostgreSQL and Redis
    docker-compose up -d postgres redis
    
    # Wait for services to be ready
    print_status "Waiting for database to be ready..."
    sleep 10
    
    # Setup database
    print_status "Setting up database..."
    cd apps/api
    npx prisma generate
    npx prisma db push
    npx prisma db seed
    cd ../..
    
    print_success "Database setup completed with Docker"
else
    print_warning "Docker not found. Please set up PostgreSQL and Redis manually."
    print_warning "Then run: cd apps/api && npx prisma db push && npx prisma db seed"
fi

# Step 4: Build applications
print_status "Building applications..."
pnpm run build

print_success "Applications built successfully"

# Step 5: Start development servers
print_status "Starting development servers..."
echo ""
echo "🚀 Starting FuMu development environment..."
echo ""
echo "Services will be available at:"
echo "  - Web App: http://localhost:3000"
echo "  - API: http://localhost:3001"
echo "  - Database: localhost:5432"
echo "  - Redis: localhost:6379"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start services in background
pnpm run dev &
DEV_PID=$!

# Wait for user to stop
wait $DEV_PID

print_success "🎬 FuMu development setup completed!"
echo ""
echo "Next steps:"
echo "1. Update .env with your API keys (OpenAI, Clerk, etc.)"
echo "2. Visit http://localhost:3000 to see the app"
echo "3. Check http://localhost:3001/health for API status"
echo "4. Run 'pnpm run dev' to start development servers"
echo ""
