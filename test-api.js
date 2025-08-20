#!/usr/bin/env node

// Test script to verify Hostaway API credentials

async function testHostawayAPI() {
  const accountId = '61148';
  const apiKey = 'f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152';
  const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI2MTE0OCIsImp0aSI6IjZlNGI1YjY4MzVjYjA2NmQ3ZjRkOGEyMTJmYmVjZTJiMWI1NDU4MjY2M2IwMjU4MDRjMTcxNDRkNzQwZDYyYzZhYTM1ODUwMjhlODFmMDE5IiwiaWF0IjoxNzU1NzEwMjU4LjAwOTcxNCwibmJmIjoxNzU1NzEwMjU4LjAwOTcxNiwiZXhwIjoyMDcxMjQzMDU4LjAwOTcxOSwic3ViIjoiIiwic2NvcGVzIjpbImdlbmVyYWwiXSwic2VjcmV0SWQiOjY1MzEwfQ.RiHaMdNM8Kkgh60GW52W0ZIOQXAdaXd3O3IfwVFSVSYdZsRaaWoLGw_1KglJIAydM31Iav3NNL0VTl2HmHSM8AITYDUo2bdjiZ6oe6lg-uaChA8-H-A-aTU56zV4WXwkL3B3W07bUihVq3ahdrCDMz1iXQIzMJHet1C5Kbzi8moFj1e4HKEDMsMQiOkFh9qIrZsqrUouA-RLHo9Lt0OtBO8YgzIo73jWJvl7JH6lyjzINCs1RQ5HicjfR0qK-iKqUqubBebIcK1T5wzVdsuL2loKW2uCYzPN24M92_dLumlUw-wXqEiUba6_36P86vv8tUjJhzuTBhkmq4mN3-eybQ'

  console.log('Testing Hostaway API Credentials...\n');
  
  // Test 1: Reviews endpoint
  console.log('1. Testing Reviews API...');
  try {
    const reviewsResponse = await fetch(`https://api.hostaway.com/v1/reviews?accountId=${accountId}&limit=5`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const reviewsData = await reviewsResponse.json();
    console.log(`   Status: ${reviewsResponse.status}`);
    console.log(`   Response:`, JSON.stringify(reviewsData, null, 2));
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
  
  console.log('\n2. Testing Listings API...');
  try {
    const listingsResponse = await fetch(`https://api.hostaway.com/v1/listings?accountId=${accountId}&limit=5`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const listingsData = await listingsResponse.json();
    console.log(`   Status: ${listingsResponse.status}`);
    console.log(`   Response:`, JSON.stringify(listingsData, null, 2));
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
  
  console.log('\n3. Testing Sandbox API...');
  try {
    const sandboxResponse = await fetch(`https://api.sandbox.hostaway.com/v1/reviews?accountId=${accountId}&limit=5`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const sandboxData = await sandboxResponse.json();
    console.log(`   Status: ${sandboxResponse.status}`);
    console.log(`   Response:`, JSON.stringify(sandboxData, null, 2));
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
}

testHostawayAPI().catch(console.error);
