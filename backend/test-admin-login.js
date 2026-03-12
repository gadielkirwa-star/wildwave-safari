#!/usr/bin/env node

const http = require('http');

// Test admin login
const postData = JSON.stringify({
  email: 'wildwavesafaris@gmail.com',
  password: 'winny@2026'
});

const options = {
  hostname: 'wildwave-safaris-api.onrender.com',
  port: 443,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
};

console.log('Testing admin login...');
console.log('Email: wildwavesafaris@gmail.com');
console.log('Password: winny@2026');
console.log('');

const https = require('https');
const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log('Response:');
    console.log(data);
    console.log('');
    
    if (res.statusCode === 200) {
      const response = JSON.parse(data);
      console.log('✅ Login successful!');
      console.log(`Token: ${response.token.substring(0, 20)}...`);
    } else if (res.statusCode === 401) {
      console.log('❌ Login failed: Invalid credentials');
      console.log('The admin user may not exist or password is wrong');
    } else {
      console.log(`❌ Login failed with status ${res.statusCode}`);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(postData);
req.end();
