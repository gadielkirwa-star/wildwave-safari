#!/bin/bash

# Git status and commit changes
echo "Staging all changes..."
cd /home/user/Public/wild-waves-safaris/savanna-vision-craft

# Show current status
echo "Current git status:"
git status --short | head -20

echo ""
echo "Committing changes..."
git add .

echo ""
echo "Commit summary:"
git log -1 --format="%H %s" || echo "No previous commits"

echo ""
echo "Ready to commit. These files will be included:"
git diff --cached --name-only

echo ""
echo "To push: git push origin main"
