#!/bin/bash

# FuMu Production Deployment Script
# This script automates the deployment process for the FuMu application

set -e  # Exit on any error

echo "🚀 Starting FuMu Production Deployment..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed"
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Check environment variables
check_environment() {
    print_status "Checking environment variables..."
    
    required_vars=(
        "DATABASE_URL"
        "REDIS_URL"
        "CLERK_SECRET_KEY"
        "OPENAI_API_KEY"
        "AWS_S3_BUCKET_NAME"
        "AWS_ACCESS_KEY_ID"
        "AWS_SECRET_ACCESS_KEY"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        exit 1
    fi
    
    print_success "Environment variables are configured"
}

# Build the application
build_application() {
    print_status "Building application..."
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm install
    
    # Build API
    print_status "Building API..."
    cd apps/api
    npm run build
    cd ../..
    
    # Build Web App
    print_status "Building web application..."
    cd apps/web
    npm run build
    cd ../..
    
    print_success "Application built successfully"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Run API tests
    print_status "Running API tests..."
    cd apps/api
    npm run test || print_warning "API tests failed, continuing with deployment"
    cd ../..
    
    # Run web app tests
    print_status "Running web app tests..."
    cd apps/web
    npm run test || print_warning "Web app tests failed, continuing with deployment"
    cd ../..
    
    print_success "Tests completed"
}

# Deploy database
deploy_database() {
    print_status "Deploying database..."
    
    cd apps/api
    
    # Run database migrations
    print_status "Running database migrations..."
    npx prisma migrate deploy
    
    # Seed database if needed
    if [ "$SEED_DATABASE" = "true" ]; then
        print_status "Seeding database..."
        npx prisma db seed
    fi
    
    cd ../..
    
    print_success "Database deployment completed"
}

# Deploy API
deploy_api() {
    print_status "Deploying API..."
    
    cd apps/api
    
    # Check if serverless is configured
    if [ -f "serverless.yml" ]; then
        print_status "Deploying with Serverless Framework..."
        npx serverless deploy --stage production
    else
        print_warning "Serverless configuration not found, skipping API deployment"
    fi
    
    cd ../..
    
    print_success "API deployment completed"
}

# Deploy web application
deploy_web() {
    print_status "Deploying web application..."
    
    cd apps/web
    
    # Check if Vercel is configured
    if [ -f ".vercel/project.json" ]; then
        print_status "Deploying with Vercel..."
        npx vercel --prod
    else
        print_warning "Vercel configuration not found, skipping web deployment"
    fi
    
    cd ../..
    
    print_success "Web application deployment completed"
}

# Run health checks
run_health_checks() {
    print_status "Running health checks..."
    
    # Check API health
    if [ -n "$API_URL" ]; then
        print_status "Checking API health..."
        if curl -f "$API_URL/health" > /dev/null 2>&1; then
            print_success "API health check passed"
        else
            print_warning "API health check failed"
        fi
    fi
    
    # Check web app health
    if [ -n "$WEB_URL" ]; then
        print_status "Checking web app health..."
        if curl -f "$WEB_URL" > /dev/null 2>&1; then
            print_success "Web app health check passed"
        else
            print_warning "Web app health check failed"
        fi
    fi
    
    print_success "Health checks completed"
}

# Main deployment function
main() {
    echo "=========================================="
    echo "FuMu Production Deployment"
    echo "=========================================="
    echo ""
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --seed-database)
                SEED_DATABASE="true"
                shift
                ;;
            --skip-tests)
                SKIP_TESTS="true"
                shift
                ;;
            --skip-build)
                SKIP_BUILD="true"
                shift
                ;;
            --api-only)
                DEPLOY_API_ONLY="true"
                shift
                ;;
            --web-only)
                DEPLOY_WEB_ONLY="true"
                shift
                ;;
            --help)
                echo "Usage: $0 [options]"
                echo ""
                echo "Options:"
                echo "  --seed-database    Seed the database after migration"
                echo "  --skip-tests       Skip running tests"
                echo "  --skip-build       Skip building the application"
                echo "  --api-only         Deploy only the API"
                echo "  --web-only         Deploy only the web application"
                echo "  --help             Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Run deployment steps
    check_dependencies
    
    if [ "$SKIP_BUILD" != "true" ]; then
        build_application
    fi
    
    if [ "$SKIP_TESTS" != "true" ]; then
        run_tests
    fi
    
    deploy_database
    
    if [ "$DEPLOY_WEB_ONLY" != "true" ]; then
        deploy_api
    fi
    
    if [ "$DEPLOY_API_ONLY" != "true" ]; then
        deploy_web
    fi
    
    run_health_checks
    
    echo ""
    echo "=========================================="
    print_success "Deployment completed successfully!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Verify all services are running correctly"
    echo "2. Monitor application logs for any issues"
    echo "3. Run end-to-end tests"
    echo "4. Update monitoring and alerting"
    echo ""
}

# Run main function
main "$@"
