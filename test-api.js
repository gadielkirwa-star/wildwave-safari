#!/usr/bin/env node

// Simple test to verify API endpoint returns data
const testAPI = async () => {
  try {
    console.log('Testing API endpoints...\n');

    // Test destinations
    console.log('1. Testing /api/public/destinations');
    const destRes = await fetch('https://wildwave-safaris-api.onrender.com/api/public/destinations');
    if (!destRes.ok) {
      console.error(`  ❌ Status: ${destRes.status}`);
      return;
    }
    const destinations = await destRes.json();
    console.log(`  ✓ Status: 200`);
    console.log(`  ✓ Returned ${destinations.length} destinations`);
    
    if (destinations.length > 0) {
      const first = destinations[0];
      console.log(`\n  First destination:`);
      console.log(`    - id: ${first.id}`);
      console.log(`    - name: ${first.name}`);
      console.log(`    - image_url: ${first.image_url ? '✓ Present' : '❌ Missing'}`);
      console.log(`    - image_url value: ${first.image_url}`);
      console.log(`    - category: ${first.category}`);
    }

    // Test packages
    console.log('\n2. Testing /api/public/packages');
    const pkgRes = await fetch('https://wildwave-safaris-api.onrender.com/api/public/packages');
    if (!pkgRes.ok) {
      console.error(`  ❌ Status: ${pkgRes.status}`);
      return;
    }
    const packages = await pkgRes.json();
    console.log(`  ✓ Status: 200`);
    console.log(`  ✓ Returned ${packages.length} packages`);
    
    if (packages.length > 0) {
      const first = packages[0];
      console.log(`\n  First package:`);
      console.log(`    - id: ${first.id}`);
      console.log(`    - name: ${first.name}`);
      console.log(`    - image_url: ${first.image_url ? '✓ Present' : '❌ Missing'}`);
      console.log(`    - image_url value: ${first.image_url}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
};

testAPI();
