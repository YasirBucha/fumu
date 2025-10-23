#!/bin/bash

# FuMu Database Setup Script
# This script sets up the database for the FuMu AI Movie Creation App

set -e

echo "🗄️ Setting up FuMu Database"
echo "============================"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   On macOS: brew install postgresql"
    echo "   On Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

echo "✅ PostgreSQL is installed"

# Check if Redis is installed
if ! command -v redis-server &> /dev/null; then
    echo "❌ Redis is not installed. Please install Redis first."
    echo "   On macOS: brew install redis"
    echo "   On Ubuntu: sudo apt-get install redis-server"
    exit 1
fi

echo "✅ Redis is installed"

# Create database if it doesn't exist
echo "📊 Creating database..."
createdb fumu 2>/dev/null || echo "Database 'fumu' already exists"

# Set up Prisma
echo "🔧 Setting up Prisma..."
cd apps/api
npx prisma generate
npx prisma db push

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update your .env file with your database credentials"
echo "2. Run 'pnpm db:migrate' to create database tables"
echo "3. Run 'pnpm db:seed' to seed the database with sample data"
echo ""
echo "🚀 Happy coding!"
