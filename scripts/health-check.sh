#!/bin/bash

# FuMu Health Check Script
# This script performs comprehensive health checks on the FuMu application

set -e

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

# Configuration
API_URL=${API_URL:-"http://localhost:3001"}
WEB_URL=${WEB_URL:-"http://localhost:3000"}
TIMEOUT=${TIMEOUT:-10}

# Health check counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Function to perform HTTP health check
check_http_endpoint() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    print_status "Checking $description at $url"
    
    if response=$(curl -s -w "%{http_code}" -o /dev/null --max-time $TIMEOUT "$url" 2>/dev/null); then
        if [ "$response" = "$expected_status" ]; then
            print_success "$description is healthy (HTTP $response)"
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
            return 0
        else
            print_error "$description returned HTTP $response (expected $expected_status)"
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
            return 1
        fi
    else
        print_error "$description is unreachable"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Function to check API health endpoints
check_api_health() {
    print_status "Checking API health endpoints..."
    
    # Basic health check
    check_http_endpoint "$API_URL/health" "API Health Check"
    
    # Readiness check
    check_http_endpoint "$API_URL/health/ready" "API Readiness Check"
    
    # Liveness check
    check_http_endpoint "$API_URL/health/live" "API Liveness Check"
}

# Function to check API endpoints
check_api_endpoints() {
    print_status "Checking API endpoints..."
    
    # Check if API returns proper JSON for health endpoint
    if response=$(curl -s --max-time $TIMEOUT "$API_URL/health" 2>/dev/null); then
        if echo "$response" | jq . > /dev/null 2>&1; then
            print_success "API returns valid JSON"
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
        else
            print_warning "API health endpoint does not return valid JSON"
            WARNING_CHECKS=$((WARNING_CHECKS + 1))
        fi
    else
        print_error "API health endpoint is unreachable"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
}

# Function to check database connectivity
check_database() {
    print_status "Checking database connectivity..."
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if response=$(curl -s --max-time $TIMEOUT "$API_URL/health" 2>/dev/null); then
        if echo "$response" | jq -e '.services.database' > /dev/null 2>&1; then
            db_status=$(echo "$response" | jq -r '.services.database')
            if [ "$db_status" = "connected" ]; then
                print_success "Database is connected"
                PASSED_CHECKS=$((PASSED_CHECKS + 1))
            else
                print_error "Database status: $db_status"
                FAILED_CHECKS=$((FAILED_CHECKS + 1))
            fi
        else
            print_warning "Database status not available in health check"
            WARNING_CHECKS=$((WARNING_CHECKS + 1))
        fi
    else
        print_error "Cannot check database status"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

# Function to check Redis connectivity
check_redis() {
    print_status "Checking Redis connectivity..."
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if response=$(curl -s --max-time $TIMEOUT "$API_URL/health" 2>/dev/null); then
        if echo "$response" | jq -e '.services.redis' > /dev/null 2>&1; then
            redis_status=$(echo "$response" | jq -r '.services.redis')
            if [ "$redis_status" = "connected" ]; then
                print_success "Redis is connected"
                PASSED_CHECKS=$((PASSED_CHECKS + 1))
            else
                print_error "Redis status: $redis_status"
                FAILED_CHECKS=$((FAILED_CHECKS + 1))
            fi
        else
            print_warning "Redis status not available in health check"
            WARNING_CHECKS=$((WARNING_CHECKS + 1))
        fi
    else
        print_error "Cannot check Redis status"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

# Function to check AI services
check_ai_services() {
    print_status "Checking AI services..."
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if response=$(curl -s --max-time $TIMEOUT "$API_URL/health" 2>/dev/null); then
        if echo "$response" | jq -e '.services.ai' > /dev/null 2>&1; then
            ai_status=$(echo "$response" | jq -r '.services.ai')
            if [ "$ai_status" = "configured" ]; then
                print_success "AI services are configured"
                PASSED_CHECKS=$((PASSED_CHECKS + 1))
            else
                print_warning "AI services status: $ai_status"
                WARNING_CHECKS=$((WARNING_CHECKS + 1))
            fi
        else
            print_warning "AI services status not available in health check"
            WARNING_CHECKS=$((WARNING_CHECKS + 1))
        fi
    else
        print_error "Cannot check AI services status"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

# Function to check web application
check_web_app() {
    print_status "Checking web application..."
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if response=$(curl -s -w "%{http_code}" -o /dev/null --max-time $TIMEOUT "$WEB_URL" 2>/dev/null); then
        if [ "$response" = "200" ]; then
            print_success "Web application is accessible"
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
        else
            print_error "Web application returned HTTP $response"
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
        fi
    else
        print_error "Web application is unreachable"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

# Function to check video processing
check_video_processing() {
    print_status "Checking video processing capabilities..."
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    # Check if video endpoints are accessible
    if response=$(curl -s -w "%{http_code}" -o /dev/null --max-time $TIMEOUT "$API_URL/video/export-options" 2>/dev/null); then
        if [ "$response" = "401" ] || [ "$response" = "200" ]; then
            print_success "Video processing endpoints are accessible"
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
        else
            print_error "Video processing endpoints returned HTTP $response"
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
        fi
    else
        print_error "Video processing endpoints are unreachable"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

# Function to check FFmpeg
check_ffmpeg() {
    print_status "Checking FFmpeg availability..."
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if command -v ffmpeg &> /dev/null; then
        ffmpeg_version=$(ffmpeg -version 2>&1 | head -n 1)
        print_success "FFmpeg is available: $ffmpeg_version"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        print_warning "FFmpeg is not available in system PATH"
        WARNING_CHECKS=$((WARNING_CHECKS + 1))
    fi
}

# Function to generate health report
generate_report() {
    echo ""
    echo "=========================================="
    echo "Health Check Report"
    echo "=========================================="
    echo "Total Checks: $TOTAL_CHECKS"
    echo "Passed: $PASSED_CHECKS"
    echo "Failed: $FAILED_CHECKS"
    echo "Warnings: $WARNING_CHECKS"
    echo ""
    
    if [ $FAILED_CHECKS -eq 0 ]; then
        if [ $WARNING_CHECKS -eq 0 ]; then
            print_success "All health checks passed!"
            return 0
        else
            print_warning "Health checks passed with warnings"
            return 1
        fi
    else
        print_error "Some health checks failed"
        return 2
    fi
}

# Function to show help
show_help() {
    echo "FuMu Health Check Script"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --api-url URL      API URL to check (default: http://localhost:3001)"
    echo "  --web-url URL      Web URL to check (default: http://localhost:3000)"
    echo "  --timeout SECONDS  Timeout for HTTP requests (default: 10)"
    echo "  --help             Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  API_URL            API URL to check"
    echo "  WEB_URL            Web URL to check"
    echo "  TIMEOUT            Timeout for HTTP requests"
}

# Main function
main() {
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --api-url)
                API_URL="$2"
                shift 2
                ;;
            --web-url)
                WEB_URL="$2"
                shift 2
                ;;
            --timeout)
                TIMEOUT="$2"
                shift 2
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    echo "=========================================="
    echo "FuMu Health Check"
    echo "=========================================="
    echo "API URL: $API_URL"
    echo "Web URL: $WEB_URL"
    echo "Timeout: ${TIMEOUT}s"
    echo "=========================================="
    echo ""
    
    # Run health checks
    check_api_health
    check_api_endpoints
    check_database
    check_redis
    check_ai_services
    check_web_app
    check_video_processing
    check_ffmpeg
    
    # Generate report
    generate_report
}

# Run main function
main "$@"
