import { NextResponse } from 'next/server';

/**
 * Google Places API Reviews integration
 * This is a stub implementation that can be extended with actual Google Places API integration
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    // Check if Google Places API is configured
    if (!apiKey) {
      return NextResponse.json({
        source: 'google',
        enabled: false,
        message: 'Google Places API key not configured',
        listings: []
      });
    }
    
    if (!placeId) {
      return NextResponse.json(
        { 
          error: 'Missing required parameter',
          details: 'placeId parameter is required'
        },
        { status: 400 }
      );
    }
    
    try {
      // Fetch place details with reviews from Google Places API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,reviews,rating,user_ratings_total&key=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Google Places API status: ${data.status}`);
      }
      
      // Normalize Google Reviews to our schema
      const normalizedReviews = (data.result.reviews || []).map(review => ({
        id: `google:${review.time}:${review.author_name.replace(/\s/g, '')}`,
        channel: 'google',
        reviewType: 'guest-to-host',
        status: 'published',
        ratingOverall5: review.rating,
        ratingOverall10: review.rating * 2,
        categories: {}, // Google doesn't provide category breakdowns
        submittedAt: new Date(review.time * 1000).toISOString(),
        authorName: review.author_name,
        text: review.text,
        approved: false, // Default to not approved
        listing: {
          name: data.result.name,
          slug: placeId // Use placeId as slug for Google reviews
        },
        googleSpecific: {
          authorUrl: review.author_url,
          profilePhotoUrl: review.profile_photo_url,
          relativeTimeDescription: review.relative_time_description
        }
      }));
      
      // Calculate metrics
      const avgRating5 = normalizedReviews.length > 0 
        ? Math.round((normalizedReviews.reduce((sum, r) => sum + r.ratingOverall5, 0) / normalizedReviews.length) * 2) / 2
        : null;
      
      return NextResponse.json({
        source: 'google',
        enabled: true,
        fetchedAt: new Date().toISOString(),
        listings: [{
          listingId: placeId,
          listingName: data.result.name,
          reviews: normalizedReviews,
          metrics: {
            avgRating5,
            avgRating10: avgRating5 ? avgRating5 * 2 : null,
            count: normalizedReviews.length,
            lastReviewAt: normalizedReviews.length > 0 
              ? normalizedReviews.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0].submittedAt 
              : null,
            categoryAverages: {},
            googleRating: data.result.rating,
            totalRatings: data.result.user_ratings_total
          }
        }]
      });
      
    } catch (apiError) {
      console.error('Google Places API error:', apiError);
      
      // Return stub data for development/demo purposes
      return NextResponse.json({
        source: 'google',
        enabled: true,
        demo: true,
        message: 'Using demo data - Google Places API call failed',
        fetchedAt: new Date().toISOString(),
        listings: [{
          listingId: placeId,
          listingName: 'Demo Property (Google)',
          reviews: [
            {
              id: `google:demo:1`,
              channel: 'google',
              reviewType: 'guest-to-host',
              status: 'published',
              ratingOverall5: 5,
              ratingOverall10: 10,
              categories: {},
              submittedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              authorName: 'Demo Reviewer',
              text: 'Great place! This is a demo review from Google Places API integration.',
              approved: false,
              listing: {
                name: 'Demo Property (Google)',
                slug: placeId
              }
            }
          ],
          metrics: {
            avgRating5: 5,
            avgRating10: 10,
            count: 1,
            lastReviewAt: new Date(Date.now() - 86400000).toISOString(),
            categoryAverages: {},
            googleRating: 4.5,
            totalRatings: 150
          }
        }],
        error: apiError.message
      });
    }
    
  } catch (error) {
    console.error('Error in Google Reviews API route:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch Google reviews',
        details: error.message,
        source: 'google'
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
