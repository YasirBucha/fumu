#!/bin/bash

# FuMu Project Setup Script
# This script sets up the development environment for the FuMu AI Movie Creation App

set -e

echo "🎬 Setting up FuMu - AI Movie Creation App"
echo "=========================================="

# Check if required tools are installed
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        exit 1
    else
        echo "✅ $1 is installed"
    fi
}

echo "🔍 Checking required tools..."
check_tool "node"
check_tool "npm"
check_tool "pnpm"
check_tool "git"

# Install pnpm if not available
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "📦 Installing dependencies..."
pnpm install --recursive

echo "🗄️ Setting up database..."
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your actual configuration values"
fi

# Set up Prisma
echo "🔧 Setting up Prisma..."
cd apps/api
if [ -f prisma/schema.prisma ]; then
    echo "📊 Generating Prisma client..."
    npx prisma generate
    echo "⚠️  Run 'pnpm db:migrate' to create your database tables"
fi
cd ../..

echo "🏗️ Building packages..."
pnpm build

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Set up your PostgreSQL database"
echo "3. Run 'pnpm db:migrate' to create database tables"
echo "4. Run 'pnpm dev' to start development servers"
echo ""
echo "🚀 Happy coding!"
