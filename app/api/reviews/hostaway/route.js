import { NextResponse } from 'next/server';
import { fetchHostawayRaw } from '@/lib/hostaway';
import { normalizeHostaway } from '@/lib/normalize';
import { readJson } from '@/lib/storage';
import { applyFilters, sortReviews } from '@/lib/analytics';
import path from 'path';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const filters = {
      listingId: searchParams.get('listingId'),
      channel: searchParams.get('channel'),
      ratingMin: searchParams.get('ratingMin') ? parseFloat(searchParams.get('ratingMin')) : undefined,
      ratingMax: searchParams.get('ratingMax') ? parseFloat(searchParams.get('ratingMax')) : undefined,
      category: searchParams.get('category'),
      from: searchParams.get('from'),
      to: searchParams.get('to'),
      approved: searchParams.get('approved') ? searchParams.get('approved') === 'true' : undefined,
      search: searchParams.get('search')
    };
    
    const sortBy = searchParams.get('sort') || 'date';
    const direction = searchParams.get('dir') || 'desc';
    const useSandbox = process.env.USE_SANDBOX === 'true';
    
    // Fetch raw data from Hostaway API or mock
    const rawData = await fetchHostawayRaw({ useSandbox });
    
    // Load approval data
    const approvalsPath = path.join(process.cwd(), 'data/approvals.json');
    const approvals = await readJson(approvalsPath);
    
    // Normalize the data
    const normalizedData = normalizeHostaway(rawData, approvals);
    
    // Apply filters to all reviews across listings
    let allReviews = [];
    normalizedData.listings.forEach(listing => {
      listing.reviews.forEach(review => {
        allReviews.push(review);
      });
    });
    
    // Apply filters and sorting
    const filteredReviews = applyFilters(allReviews, filters);
    const sortedReviews = sortReviews(filteredReviews, sortBy, direction);
    
    // If filtering by specific listing, return just that listing
    if (filters.listingId) {
      const targetListing = normalizedData.listings.find(l => l.listingId === filters.listingId);
      if (targetListing) {
        // Replace reviews with filtered/sorted ones
        targetListing.reviews = sortedReviews;
        // Recalculate metrics for filtered reviews
        const { computeListingMetrics } = await import('@/lib/analytics');
        targetListing.metrics = computeListingMetrics(sortedReviews);
        
        return NextResponse.json({
          ...normalizedData,
          listings: [targetListing]
        });
      }
    }
    
    // Group filtered reviews back by listing
    const listingsMap = new Map();
    
    sortedReviews.forEach(review => {
      const listingSlug = review.listing.slug;
      
      if (!listingsMap.has(listingSlug)) {
        const originalListing = normalizedData.listings.find(l => l.listingId === listingSlug);
        listingsMap.set(listingSlug, {
          listingId: listingSlug,
          listingName: originalListing?.listingName || review.listing.name,
          reviews: []
        });
      }
      
      listingsMap.get(listingSlug).reviews.push(review);
    });
    
    // Recalculate metrics for filtered data
    const { computeListingMetrics } = await import('@/lib/analytics');
    const filteredListings = Array.from(listingsMap.values()).map(listing => ({
      ...listing,
      metrics: computeListingMetrics(listing.reviews)
    }));
    
    return NextResponse.json({
      ...normalizedData,
      listings: filteredListings,
      totalReviews: sortedReviews.length,
      appliedFilters: filters
    });
    
  } catch (error) {
    console.error('Error in Hostaway API route:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch reviews',
        details: error.message,
        source: 'hostaway'
      },
      { status: 500 }
    );
  }
}

// Add CORS headers for development
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
