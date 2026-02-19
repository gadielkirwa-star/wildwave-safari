#!/bin/bash

# Comprehensive diagnostic script to check:
# 1. API health
# 2. API response structure  
# 3. Frontend deployment status

echo "=== WILDWAVE SAFARIS DIAGNOSTIC REPORT ==="
echo ""

# Test API health
echo "1. API Health Check"
echo "-------------------"
HEALTH=$(curl -s -w "\n%{http_code}" https://wildwave-safaris-api.onrender.com/health)
STATUS=$(echo "$HEALTH" | tail -1)
BODY=$(echo "$HEALTH" | head -1)

if [ "$STATUS" = "200" ]; then
  echo "✓ API is RUNNING (Status: $STATUS)"
  echo "  Response: $BODY"
else
  echo "✗ API is DOWN (Status: $STATUS)"
fi
echo ""

# Test destinations endpoint
echo "2. Destinations Endpoint"
echo "------------------------"
DEST=$(curl -s -w "\n%{http_code}" https://wildwave-safaris-api.onrender.com/api/public/destinations | tail -5)
DEST_CODE=$(echo "$DEST" | tail -1)

if [ "$DEST_CODE" = "200" ]; then
  echo "✓ Destinations endpoint responds (Status: $DEST_CODE)"
  
  # Get just the first destination
  FIRST_DEST=$(curl -s https://wildwave-safaris-api.onrender.com/api/public/destinations | python3 -c "import sys, json; data = json.load(sys.stdin); print(json.dumps(data[0] if data else {}, indent=2))" 2>/dev/null)
  
  if echo "$FIRST_DEST" | grep -q "image_url"; then
    echo "✓ image_url field EXISTS in response"
    IMAGE_URL=$(echo "$FIRST_DEST" | grep -o '"image_url":"[^"]*' | cut -d'"' -f4)
    if [ -n "$IMAGE_URL" ]; then
      echo "  Sample URL: ${IMAGE_URL:0:60}..."
    else
      echo "  ✗ image_url field is EMPTY/NULL"
    fi
  else
    echo "✗ image_url field MISSING from response"
    echo "$FIRST_DEST"
  fi
else
  echo "✗ Endpoints error (Status: $DEST_CODE)"
fi
echo ""

# Check if frontend code exists on Vercel
echo "3. Frontend Deployment Check"
echo "-----------------------------"
FRONTEND=$(curl -s -w "\n%{http_code}" https://wildwave-safari.vercel.app 2>&1 | tail -1)
if [ "$FRONTEND" = "200" ]; then
  echo "✓ Frontend is deployed (Status: $FRONTEND)"
else
  echo "✗ Frontend error (Status: $FRONTEND)"
fi
echo ""

# Check git commit status
echo "4. Local Git Status"
echo "-------------------"
cd /home/user/Public/wild-waves-safaris/savanna-vision-craft 2>/dev/null
if git rev-parse --git-dir > /dev/null 2>&1; then
  LATEST=$(git log -1 --format="%h %s" 2>/dev/null)
  CHANGES=$(git status -s 2>/dev/null | wc -l)
  echo "✓ Git repository found"
  echo "  Latest commit: $LATEST"
  echo "  Uncommitted changes: $CHANGES"
else
  echo "✗ Not a git repository"
fi
