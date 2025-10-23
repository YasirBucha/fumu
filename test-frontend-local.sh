#!/bin/bash

# FuMu Frontend Local Testing Script
# Test the web app running on http://localhost:3000

WEB_URL="http://localhost:3000"

echo "🌐 Testing FuMu Web App on $WEB_URL"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local endpoint="$1"
    local description="$2"
    
    echo -e "${BLUE}Testing $description...${NC}"
    
    response=$(curl -s -w "%{http_code}" "$WEB_URL$endpoint")
    status_code="${response: -3}"
    body="${response%???}"
    
    if [ "$status_code" = "200" ]; then
        echo -e "${GREEN}✅ $description - OK (HTTP $status_code)${NC}"
        # Check if it's HTML content
        if echo "$body" | grep -q "<!DOCTYPE html\|<html"; then
            echo "📄 HTML content detected"
        else
            echo "📄 Content: ${body:0:100}..."
        fi
    else
        echo -e "${RED}❌ $description - Failed (HTTP $status_code)${NC}"
        echo "Response: ${body:0:200}..."
    fi
    echo ""
}

# Check if the web app is running
echo -e "${BLUE}Checking if web app is running...${NC}"
if curl -f -s "$WEB_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Web app is running${NC}"
    echo ""
    
    # Test main pages
    test_endpoint "/" "Home Page"
    test_endpoint "/dashboard" "Dashboard Page"
    test_endpoint "/projects" "Projects Page"
    test_endpoint "/characters" "Characters Page"
    test_endpoint "/video-processing" "Video Processing Page"
    
else
    echo -e "${RED}❌ Web app is not running${NC}"
    echo ""
    echo "🔧 To start the web app:"
    echo "1. Open a new terminal"
    echo "2. Run: cd /Users/yb/Development/FuMu/apps/web"
    echo "3. Run: npm run dev"
    echo "4. Wait for it to start on http://localhost:3000"
    echo ""
fi

echo "=================================="
echo "🎉 Frontend Testing Complete!"
echo ""
echo "📋 Available pages:"
echo "- / - Home page"
echo "- /dashboard - User dashboard"
echo "- /projects - Project management"
echo "- /projects/new - Create new project"
echo "- /projects/[id] - View/edit project"
echo "- /projects/[id]/new-scene - Create new scene"
echo "- /projects/[id]/export - Export movie"
echo "- /characters - Character management"
echo "- /characters/new - Create new character"
echo "- /video-processing - Video processing history"
echo "- /admin/video-queue - Admin video queue"
echo ""
echo "🔧 To test with authentication:"
echo "1. Set up Clerk authentication"
echo "2. Sign up/login through the web interface"
echo "3. Test authenticated features"
