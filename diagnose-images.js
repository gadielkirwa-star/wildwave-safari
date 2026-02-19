#!/usr/bin/env node

/**
 * CRITICAL DIAGNOSTIC: Image URL Source Issue
 * 
 * Purpose: Trace where images are coming from and why they're wrong
 * 
 * Usage: node diagnose-images.js
 */

console.log('\n🔍 IMAGE URL DIAGNOSTIC - FINDING WRONG IMAGE SOURCES\n');
console.log('==========================================\n');

const fs = require('fs');
const path = require('path');

// Step 1: Check frontend code for image mappings
console.log('STEP 1: Frontend Code Analysis');
console.log('------------------------------\n');

const files = [
  'src/pages/Index.tsx',
  'src/pages/Destinations.tsx',
  'src/pages/Packages.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for image field usage
    const hasImageUrl = content.includes('dest.image_url') || content.includes('pkg.image_url');
    const hasImage = content.includes('image:') && content.includes('image_url');
    const hasFallback = content.includes('fallbackDestinations') || content.includes('fallbackPackages');
    
    console.log(`✓ ${file}`);
    if (hasImageUrl) console.log('  └─ Uses image_url field');
    if (hasImage) console.log('  └─ Maps image_url to image field');
    if (hasFallback) console.log('  └─ Has fallback data');
    
    // Look for fetch calls
    if (content.includes('fetch')) {
      const fetchMatch = content.match(/fetch\('([^']+)'/);
      if (fetchMatch) {
        console.log(`  └─ Fetches from: ${fetchMatch[1]}`);
      }
    }
    console.log('');
  }
});

// Step 2: Check backend API endpoints
console.log('STEP 2: Backend SQL Queries');
console.log('---------------------------\n');

const backendPath = path.join(__dirname, 'backend/src/routes/public.js');
if (fs.existsSync(backendPath)) {
  const content = fs.readFileSync(backendPath, 'utf8');
  
  // Extract SQL queries
  const sqlMatches = content.match(/pool\.query\('([^']+)'/g);
  if (sqlMatches) {
    sqlMatches.forEach(match => {
      const sql = match.replace(/pool\.query\('/, '').replace(/'/, '');
      console.log(`Query: ${sql}`);
      if (sql.includes('SELECT')) {
        console.log('✓ Should return all fields including image_url\n');
      }
    });
  }
} else {
  console.log('⚠ Backend file not found\n');
}

// Step 3: Database schema check
console.log('STEP 3: Database Schema Check');
console.log('-----------------------------\n');

const schemaPath = path.join(__dirname, 'backend/schema.sql');
if (fs.existsSync(schemaPath)) {
  const content = fs.readFileSync(schemaPath, 'utf8');
  
  const destMatch = content.match(/CREATE TABLE.*?destinations.*?\([\s\S]*?\);/);
  if (destMatch) {
    console.log('✓ destinations table exists');
    if (destMatch[0].includes('image_url')) {
      console.log('  ✓ Has image_url column');
    }
  }
  
  const pkgMatch = content.match(/CREATE TABLE.*?packages.*?\([\s\S]*?\);/);
  if (pkgMatch) {
    console.log('✓ packages table exists');
    if (pkgMatch[0].includes('image_url')) {
      console.log('  ✓ Has image_url column');
    }
  }
  console.log('');
}

// Step 4: Check for image data in schema.sql
console.log('STEP 4: Sample Image URLs in Schema');
console.log('------------------------------------\n');

if (fs.existsSync(schemaPath)) {
  const content = fs.readFileSync(schemaPath, 'utf8');
  
  // Find INSERT statements with image_url
  const insertMatches = content.match(/INSERT INTO.*?VALUES[\s\S]*?\);/g);
  if (insertMatches) {
    let imageCount = 0;
    insertMatches.forEach(match => {
      if (match.includes('image_url') || match.includes('https://')) {
        imageCount++;
        // Extract first image URL
        const urlMatch = match.match(/'(https:\/\/[^']+)'/);
        if (urlMatch) {
          console.log(`Found: ${urlMatch[1]}`);
        }
      }
    });
    if (imageCount > 0) {
      console.log(`\nTotal entries with images: ${imageCount}`);
    }
  }
  console.log('');
}

// Step 5: Detection questions
console.log('STEP 5: Diagnostic Questions');
console.log('----------------------------\n');

console.log('Q1: What URLs are you seeing on localhost?');
console.log('   - Are they /assets/... (local fallback)?');
console.log('   - Or images.unsplash.com (database)?');
console.log('   - Or something else?');
console.log('   → This tells us if it\'s fetching at all\n');

console.log('Q2: Are the package NAMES correct but IMAGES wrong?');
console.log('   - If names are right → API is working');
console.log('   - If images are wrong → image_url field has wrong values\n');

console.log('Q3: What does the Network tab show?');
console.log('   1. Open browser DevTools (F12)');
console.log('   2. Go to Network tab');
console.log('   3. Refresh page');
console.log('   4. Find /api/public/packages request');
console.log('   5. Click it and check Response');
console.log('   6. Look for image_url values\n');

console.log('Q4: What does the database contain?');
console.log('   Run: SELECT name, price, image_url FROM packages LIMIT 3;\n');

// Step 6: Likely issues
console.log('STEP 6: Likely Issues (Ranked by Probability)');
console.log('---------------------------------------------\n');

console.log('🔴 CRITICAL ISSUE #1: Database has WRONG image_url values');
console.log('   Symptom: Correct package names/prices, but wrong images');
console.log('   Fix: Update image_url in database to correct Unsplash URLs\n');

console.log('🟡 ISSUE #2: Frontend using fallback instead of API data');
console.log('   Symptom: Always shows same local images regardless of data');
console.log('   Fix: Check browser console for fetch errors\n');

console.log('🟡 ISSUE #3: Frontend using wrong field name');
console.log('   Symptom: Blank images or 404s');
console.log('   Fix: Ensure code uses pkg.image_url not pkg.image\n');

console.log('🟢 ISSUE #4: Correct setup, just cache issue');
console.log('   Symptom: Inconsistent image display');
console.log('   Fix: Hard refresh (Ctrl+Shift+R) or clear browser cache\n');

// Step 7: Next steps
console.log('STEP 7: Next Steps to Debug');
console.log('---------------------------\n');

console.log('1. Open http://localhost:3000 in browser');
console.log('2. Press F12 → Right-click on image → Inspect');
console.log('3. Check the <img src="..."/> attribute');
console.log('4. Compare with Network tab API response');
console.log('5. If URLs don\'t match → database issue');
console.log('6. If URLs match but image broken → URL doesn\'t exist\n');

console.log('==========================================\n');
console.log('Run this to check database directly:');
console.log('');
console.log('cd backend');
console.log('node << \'EOF\'');
console.log('const pool = require("./src/config/db.js").default;');
console.log('pool.query("SELECT id, name, price, image_url FROM packages LIMIT 5")');
console.log('  .then(res => console.log(JSON.stringify(res.rows, null, 2)))');
console.log('  .catch(err => console.error(err));');
console.log('EOF');
console.log('');
console.log('==========================================\n');
