#!/bin/bash

# FuMu Database Setup Script
# This script sets up the PostgreSQL database for FuMu

set -e

echo "🗄️ Setting up FuMu Database..."

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

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL is not installed. Please install it first."
    exit 1
fi

print_status "Setting up PostgreSQL database..."

# Get database configuration from environment or use defaults
DB_NAME=${DATABASE_NAME:-fumu_production}
DB_USER=${DATABASE_USER:-fumu_user}
DB_PASSWORD=${DATABASE_PASSWORD:-fumu_secure_password}
DB_HOST=${DATABASE_HOST:-localhost}
DB_PORT=${DATABASE_PORT:-5432}

print_status "Database configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"

# Create database if it doesn't exist
print_status "Creating database..."
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" || print_warning "Database may already exist"

# Create user if it doesn't exist
print_status "Creating database user..."
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" || print_warning "User may already exist"

# Grant privileges
print_status "Granting privileges..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"

print_success "Database user created"

# Update environment file
print_status "Updating environment configuration..."
ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
    cp env.example "$ENV_FILE"
    print_warning "Created $ENV_FILE from template"
fi

# Update database URL in environment file
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"$DATABASE_URL\"|" "$ENV_FILE"
sed -i.bak "s|DIRECT_URL=.*|DIRECT_URL=\"$DATABASE_URL\"|" "$ENV_FILE"

print_success "Environment file updated"

# Navigate to API directory and run Prisma commands
print_status "Running Prisma commands..."
cd apps/api

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Push database schema
print_status "Pushing database schema..."
npx prisma db push

# Seed database
print_status "Seeding database..."
npx prisma db seed || print_warning "Seeding may have failed or already completed"

cd ../..

print_success "Database setup completed!"

echo
echo "Database information:"
echo "  Connection string: $DATABASE_URL"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo
echo "Next steps:"
echo "1. Verify database connection: cd apps/api && npx prisma studio"
echo "2. Check database schema: npx prisma db pull"
echo "3. Run migrations: npx prisma migrate deploy"
echo
echo "To connect to the database manually:"
echo "  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"