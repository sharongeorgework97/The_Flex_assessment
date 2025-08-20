import { readJson } from './storage.js';
import path from 'path';

/**
 * Fetch reviews from Hostaway API (sandbox or production)
 * @param {Object} options - Configuration options
 * @param {boolean} options.useSandbox - Whether to use sandbox API
 * @returns {Promise<Object>} Raw Hostaway API response
 */
export async function fetchHostawayRaw({ useSandbox = false } = {}) {
  const accountId = process.env.HOSTAWAY_ACCOUNT_ID;
  const accessToken = process.env.HOSTAWAY_ACCESS_TOKEN;
  
  // If no API credentials, return mock data
  if (!accountId || !accessToken) {
    console.log('Using mock Hostaway data (no API credentials)');
    return await fetchMockHostawayData();
  }
  
  try {
    const baseUrl = useSandbox 
      ? 'https://api.sandbox.hostaway.com'
      : 'https://api.hostaway.com';
    
    const url = `${baseUrl}/v1/reviews?accountId=${accountId}&limit=100`;
    
    console.log(`Fetching from Hostaway API: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Cache-control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Hostaway API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Hostaway API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Check if API returned an error response
    if (data.status === 'fail') {
      console.error('Hostaway API returned error:', data.message);
      throw new Error(`Hostaway API error: ${data.message}`);
    }
    
    // If API returns no results, fallback to mock data
    if (!data.result || data.result.length === 0) {
      console.log('Hostaway API returned no results, falling back to mock data');
      return await fetchMockHostawayData();
    }
    
    console.log(`Successfully fetched ${data.result.length} reviews from Hostaway API`);
    return data;
  } catch (error) {
    console.error('Failed to fetch from Hostaway API, falling back to mock data:', error.message);
    return await fetchMockHostawayData();
  }
}

/**
 * Fetch mock Hostaway data from local file
 * @returns {Promise<Object>} Mock Hostaway API response
 */
async function fetchMockHostawayData() {
  try {
    const mockDataPath = path.join(process.cwd(), 'data/mocked-hostaway.json');
    return await readJson(mockDataPath);
  } catch (error) {
    console.error('Failed to load mock Hostaway data:', error);
    // Return empty but valid response structure
    return {
      status: 'success',
      result: []
    };
  }
}

/**
 * Validate Hostaway API credentials
 * @returns {boolean} Whether credentials are configured
 */
export function hasHostawayCredentials() {
  return !!(process.env.HOSTAWAY_ACCOUNT_ID && process.env.HOSTAWAY_ACCESS_TOKEN);
}
