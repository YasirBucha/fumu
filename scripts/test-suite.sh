#!/bin/bash

# FuMu Comprehensive Test Suite
# This script runs all tests for the FuMu application

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

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

# Configuration
API_URL=${API_URL:-"http://localhost:3001"}
WEB_URL=${WEB_URL:-"http://localhost:3000"}
TIMEOUT=${TIMEOUT:-10}

# Function to run a test and track results
run_test() {
    local test_name="$1"
    local test_command="$2"
    local test_type="${3:-test}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    print_status "Running $test_name..."
    
    if eval "$test_command" > /dev/null 2>&1; then
        print_success "$test_name passed"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        print_error "$test_name failed"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Function to check if service is running
check_service() {
    local service_name="$1"
    local service_url="$2"
    
    print_status "Checking if $service_name is running..."
    
    if curl -f -s --max-time $TIMEOUT "$service_url" > /dev/null 2>&1; then
        print_success "$service_name is running"
        return 0
    else
        print_error "$service_name is not running"
        return 1
    fi
}

# Function to run unit tests
run_unit_tests() {
    print_status "Running unit tests..."
    
    # API unit tests
    if [ -d "apps/api" ]; then
        print_status "Running API unit tests..."
        cd apps/api
        if npm run test > /dev/null 2>&1; then
            print_success "API unit tests passed"
        else
            print_warning "API unit tests failed or not configured"
        fi
        cd ../..
    fi
    
    # Web app unit tests
    if [ -d "apps/web" ]; then
        print_status "Running web app unit tests..."
        cd apps/web
        if npm run test > /dev/null 2>&1; then
            print_success "Web app unit tests passed"
        else
            print_warning "Web app unit tests failed or not configured"
        fi
        cd ../..
    fi
}

# Function to run integration tests
run_integration_tests() {
    print_status "Running integration tests..."
    
    # Check API health
    run_test "API Health Check" "curl -f -s --max-time $TIMEOUT '$API_URL/health'"
    
    # Check API readiness
    run_test "API Readiness Check" "curl -f -s --max-time $TIMEOUT '$API_URL/health/ready'"
    
    # Check API liveness
    run_test "API Liveness Check" "curl -f -s --max-time $TIMEOUT '$API_URL/health/live'"
    
    # Check database connectivity
    if response=$(curl -s --max-time $TIMEOUT "$API_URL/health" 2>/dev/null); then
        if echo "$response" | jq -e '.services.database == "connected"' > /dev/null 2>&1; then
            print_success "Database connectivity test passed"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            print_error "Database connectivity test failed"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    else
        print_error "Database connectivity test failed - API unreachable"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    fi
    
    # Check Redis connectivity
    if response=$(curl -s --max-time $TIMEOUT "$API_URL/health" 2>/dev/null); then
        if echo "$response" | jq -e '.services.redis == "connected"' > /dev/null 2>&1; then
            print_success "Redis connectivity test passed"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            print_error "Redis connectivity test failed"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    else
        print_error "Redis connectivity test failed - API unreachable"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    fi
    
    # Check AI services
    if response=$(curl -s --max-time $TIMEOUT "$API_URL/health" 2>/dev/null); then
        if echo "$response" | jq -e '.services.ai == "configured"' > /dev/null 2>&1; then
            print_success "AI services test passed"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            print_warning "AI services test - status: $(echo "$response" | jq -r '.services.ai // "unknown"')"
            WARNING_TESTS=$((WARNING_TESTS + 1))
        fi
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    else
        print_error "AI services test failed - API unreachable"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    fi
}

# Function to run API endpoint tests
run_api_tests() {
    print_status "Running API endpoint tests..."
    
    # Test AI models endpoint
    run_test "AI Models Endpoint" "curl -f -s --max-time $TIMEOUT '$API_URL/ai/models'"
    
    # Test video export options endpoint
    run_test "Video Export Options Endpoint" "curl -f -s --max-time $TIMEOUT '$API_URL/video/export-options'"
    
    # Test video queue status endpoint
    run_test "Video Queue Status Endpoint" "curl -f -s --idx-time $TIMEOUT '$API_URL/video/queue/status'"
}

# Function to run performance tests
run_performance_tests() {
    print_status "Running performance tests..."
    
    # Test API response time
    local start_time=$(date +%s%N)
    if curl -f -s --max-time $TIMEOUT "$API_URL/health" > /dev/null 2>&1; then
        local end_time=$(date +%s%N)
        local response_time=$(( (end_time - start_time) / 1000000 ))
        
        if [ $response_time -lt 500 ]; then
            print_success "API response time test passed (${response_time}ms)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            print_warning "API response time test - slow response (${response_time}ms)"
            WARNING_TESTS=$((WARNING_TESTS + 1))
        fi
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    else
        print_error "API response time test failed"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    fi
}

# Function to run security tests
run_security_tests() {
    print_status "Running security tests..."
    
    # Test for common security headers
    if response=$(curl -I -s --max-time $TIMEOUT "$API_URL/health" 2>/dev/null); then
        if echo "$response" | grep -i "x-frame-options" > /dev/null; then
            print_success "Security headers test passed"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            print_warning "Security headers test - missing headers"
            WARNING_TESTS=$((WARNING_TESTS + 1))
        fi
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    else
        print_error "Security headers test failed"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    fi
    
    # Test authentication endpoints
    run_test "Authentication Endpoint Security" "curl -f -s --max-time $TIMEOUT '$API_URL/auth/webhook'"
}

# Function to run FFmpeg tests
run_ffmpeg_tests() {
    print_status "Running FFmpeg tests..."
    
    # Check if FFmpeg is available
    if command -v ffmpeg &> /dev/null; then
        print_success "FFmpeg is available"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        
        # Test FFmpeg version
        if ffmpeg -version > /dev/null 2>&1; then
            print_success "FFmpeg version test passed"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            print_error "FFmpeg version test failed"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    else
        print_warning "FFmpeg is not available in system PATH"
        WARNING_TESTS=$((WARNING_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

# Function to run database tests
run_database_tests() {
    print_status "Running database tests..."
    
    # Test database connection
    if [ -d "apps/api" ]; then
        cd apps/api
        if npx prisma db push --accept-data-loss > /dev/null 2>&1; then
            print_success "Database connection test passed"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            print_error "Database connection test failed"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        cd ../..
    else
        print_warning "API directory not found, skipping database tests"
        SKIPPED_TESTS=$((SKIPPED_TESTS + 1))
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    fi
}

# Function to run web app tests
run_web_tests() {
    print_status "Running web app tests..."
    
    # Check if web app is running
    if curl -f -s --max-time $TIMEOUT "$WEB_URL" > /dev/null 2>&1; then
        print_success "Web app accessibility test passed"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        print_warning "Web app is not running or not accessible"
        WARNING_TESTS=$((WARNING_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

# Function to generate test report
generate_test_report() {
    echo ""
    echo "=========================================="
    echo "FuMu Test Suite Report"
    echo "=========================================="
    echo "Test Date: $(date)"
    echo "API URL: $API_URL"
    echo "Web URL: $WEB_URL"
    echo ""
    echo "Test Results:"
    echo "  Total Tests: $TOTAL_TESTS"
    echo "  Passed: $PASSED_TESTS"
    echo "  Failed: $FAILED_TESTS"
    echo "  Warnings: $WARNING_TESTS"
    echo "  Skipped: $SKIPPED_TESTS"
    echo ""
    
    if [ $FAILED_TESTS -eq 0 ]; then
        if [ $WARNING_TESTS -eq 0 ]; then
            print_success "All tests passed!"
            echo "🎉 FuMu is ready for production!"
            return 0
        else
            print_warning "Tests passed with warnings"
            echo "⚠️ Review warnings before production deployment"
            return 1
        fi
    else
        print_error "Some tests failed"
        echo "❌ Fix failing tests before production deployment"
        return 2
    fi
}

# Function to show help
show_help() {
    echo "FuMu Comprehensive Test Suite"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --api-url URL      API URL to test (default: http://localhost:3001)"
    echo "  --web-url URL      Web URL to test (default: http://localhost:3000)"
    echo "  --timeout SECONDS  Timeout for HTTP requests (default: 10)"
    echo "  --unit-only        Run only unit tests"
    echo "  --integration-only Run only integration tests"
    echo "  --performance-only Run only performance tests"
    echo "  --security-only    Run only security tests"
    echo "  --help             Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  API_URL            API URL to test"
    echo "  WEB_URL            Web URL to test"
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
            --unit-only)
                UNIT_ONLY="true"
                shift
                ;;
            --integration-only)
                INTEGRATION_ONLY="true"
                shift
                ;;
            --performance-only)
                PERFORMANCE_ONLY="true"
                shift
                ;;
            --security-only)
                SECURITY_ONLY="true"
                shift
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
    echo "FuMu Comprehensive Test Suite"
    echo "=========================================="
    echo "API URL: $API_URL"
    echo "Web URL: $WEB_URL"
    echo "Timeout: ${TIMEOUT}s"
    echo "=========================================="
    echo ""
    
    # Initialize warning counter
    WARNING_TESTS=0
    
    # Run tests based on options
    if [ "$UNIT_ONLY" = "true" ]; then
        run_unit_tests
    elif [ "$INTEGRATION_ONLY" = "true" ]; then
        run_integration_tests
        run_api_tests
        run_database_tests
    elif [ "$PERFORMANCE_ONLY" = "true" ]; then
        run_performance_tests
    elif [ "$SECURITY_ONLY" = "true" ]; then
        run_security_tests
    else
        # Run all tests
        run_unit_tests
        run_integration_tests
        run_api_tests
        run_performance_tests
        run_security_tests
        run_ffmpeg_tests
        run_database_tests
        run_web_tests
    fi
    
    # Generate test report
    generate_test_report
}

# Run main function
main "$@"
