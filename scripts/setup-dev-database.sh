#!/bin/bash

# FuMu Development Database Setup Script
# This script sets up the SQLite database for development

set -e

echo "🗄️ Setting up FuMu Development Database..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the FuMu root directory"
    exit 1
fi

print_status "Setting up development database with SQLite..."

# Navigate to API directory
cd apps/api

# Create development environment file if it doesn't exist
if [ ! -f ".env.development" ]; then
    if [ -f "../../env.development.template" ]; then
        cp ../../env.development.template .env.development
        print_warning "Created .env.development from template. Please update with your actual values."
    else
        print_warning "No development environment template found. Please create .env.development manually."
    fi
fi

# Copy development schema
if [ -f "../../prisma/schema.dev.prisma" ]; then
    cp ../../prisma/schema.dev.prisma ./prisma/schema.prisma
    print_status "Using development schema (SQLite)"
else
    print_error "Development schema not found. Please check prisma/schema.dev.prisma"
    exit 1
fi

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Push database schema (creates SQLite database)
print_status "Creating SQLite database and pushing schema..."
npx prisma db push

# Seed database
print_status "Seeding database with sample data..."
npx prisma db seed || print_warning "Seeding may have failed or already completed"

cd ../..

print_success "Development database setup completed!"

echo
echo "Database information:"
echo "  Type: SQLite"
echo "  Location: apps/api/dev.db"
echo "  Schema: Development schema with SQLite compatibility"
echo
echo "Next steps:"
echo "1. Update apps/api/.env.development with your API keys"
echo "2. Start the development servers: pnpm run dev"
echo "3. Visit http://localhost:3000 to see the app"
echo "4. Check http://localhost:3001/health for API status"
echo
echo "To view the database:"
echo "  cd apps/api && npx prisma studio"
echo
echo "To reset the database:"
echo "  cd apps/api && rm dev.db && npx prisma db push && npx prisma db seed"
