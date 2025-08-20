'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import StarRating from '@/components/StarRating';
import ChannelBadge from '@/components/ChannelBadge';
import { 
  MapPinIcon, 
  UserGroupIcon, 
  HomeIcon,
  StarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function PropertyPage() {
  const params = useParams();
  const { slug } = params;
  
  const [propertyData, setPropertyData] = useState(null);
  const [googleData, setGoogleData] = useState(null);
  const [listingData, setListingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewSort, setReviewSort] = useState('date');
  
  // Fetch property reviews and listing info
  useEffect(() => {
    const fetchPropertyData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch listing metadata first
        const listingsResponse = await fetch('/api/listings');
        const listingsData = await listingsResponse.json();
        const listing = listingsData.find(l => l.slug === slug);
        
        if (!listing) {
          throw new Error('Property not found');
        }
        
        setListingData(listing);
        
        // Fetch reviews from both sources
        const fetchPromises = [
          // Hostaway reviews
          fetch(`/api/reviews/hostaway?listingId=${slug}&approved=true&sort=${reviewSort}&dir=desc`),
          // Google reviews (if place ID exists)
          listing.googlePlaceId 
            ? fetch(`/api/reviews/google?placeId=${listing.googlePlaceId}`)
            : Promise.resolve(null)
        ];
        
        const [hostawayResponse, googleResponse] = await Promise.all(fetchPromises);
        
        if (!hostawayResponse.ok) {
          throw new Error('Failed to fetch Hostaway reviews');
        }
        
        const hostawayData = await hostawayResponse.json();
        setPropertyData(hostawayData);
        
        // Handle Google reviews
        if (googleResponse && googleResponse.ok) {
          const googleReviewsData = await googleResponse.json();
          setGoogleData(googleReviewsData);
        }
        
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch property data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchPropertyData();
    }
  }, [slug, reviewSort]);
  
  const currentListing = propertyData?.listings?.[0];
  const hostawayReviews = currentListing?.reviews?.filter(review => review.approved) || [];
  const googleReviews = googleData?.listings?.[0]?.reviews?.filter(review => review.approved) || [];
  
  // Combine reviews from both sources
  const allReviews = [...hostawayReviews, ...googleReviews];
  
  // Sort combined reviews
  const sortedReviews = allReviews.sort((a, b) => {
    switch (reviewSort) {
      case 'rating':
        return b.ratingOverall5 - a.ratingOverall5;
      case 'author':
        return (a.authorName || '').localeCompare(b.authorName || '');
      case 'date':
      default:
        return new Date(b.submittedAt) - new Date(a.submittedAt);
    }
  });
  
  // Combined metrics
  const metrics = currentListing?.metrics;
  const googleMetrics = googleData?.listings?.[0]?.metrics;
  
  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <div className="text-red-500 mb-4">
            <HomeIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Property Not Found</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <a href="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }
  
  // No listing found
  if (!currentListing && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <HomeIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Property Not Found</h3>
          <p className="text-gray-600 mb-4">
            The property "{slug}" could not be found or has no reviews.
          </p>
          <a href="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-flex-cream">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] bg-gradient-to-br from-flex-green via-flex-dark-green to-green-700 overflow-hidden">
        {/* Background Image Placeholder with Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* <div className="text-center text-white">
            <HomeIcon className="h-24 w-24 mx-auto text-white/80 mb-4" />
            <p className="text-lg text-white/90"></p>
          </div> */}
        </div>
        
        {/* Property Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div className="text-white mb-4 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  {currentListing?.listingName || listingData?.name}
                </h1>
                {listingData?.address && (
                  <div className="flex items-center text-white/90 mb-3 text-lg">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>{listingData.address}</span>
                  </div>
                )}
                <div className="flex items-center space-x-6 text-white/80">
                  {listingData?.type && (
                    <div className="flex items-center">
                      <HomeIcon className="h-5 w-5 mr-2" />
                      <span className="capitalize text-lg">{listingData.type}</span>
                    </div>
                  )}
                  {listingData?.bedrooms !== undefined && (
                    <div className="flex items-center">
                      <UserGroupIcon className="h-5 w-5 mr-2" />
                      <span className="text-lg">
                        {listingData.bedrooms === 0 ? 'Studio' : `${listingData.bedrooms} bedroom${listingData.bedrooms > 1 ? 's' : ''}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="/dashboard"
                  className="px-6 py-3 bg-white/15 backdrop-blur-sm text-white border border-white/30 rounded-lg hover:bg-white/25 transition-all duration-300 text-center font-medium"
                >
                  Manage Reviews
                </a>
                <a 
                  href="/properties"
                  className="px-6 py-3 bg-white text-flex-green rounded-lg hover:bg-flex-beige transition-colors font-medium text-center shadow-lg"
                >
                  View All Properties
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8px-4 sm:px-6 lg:px-8 py-12">
        {/* Property Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-flex-beige/50">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-amber-50 rounded-full p-3 border-2 border-amber-200">
                <StarIcon className="h-8 w-8 text-amber-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-flex-green mb-2">
              {metrics?.avgRating5?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-flex-dark-green mb-3 font-medium">Average Rating</div>
            {metrics?.avgRating5 && (
              <StarRating rating={metrics.avgRating5} size="sm" className="justify-center" />
            )}
          </div>
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-flex-beige/50">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-flex-beige rounded-full p-3 border-2 border-flex-dark-green/30">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-flex-green" />
              </div>
            </div>
            <div className="text-3xl font-bold text-flex-green mb-2">
              {allReviews.length}
            </div>
            <div className="text-flex-dark-green font-medium">Guest Reviews</div>
            {googleMetrics?.totalRatings && (
              <div className="text-xs text-flex-dark-green/70 mt-1">
                {googleMetrics.totalRatings} on Google
              </div>
            )}
          </div>
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-flex-beige/50">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-50 rounded-full p-3 border-2 border-green-200">
                <StarIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-flex-green mb-2">
              {metrics?.lastReviewAt ? format(new Date(metrics.lastReviewAt), 'MMM yyyy') : 'N/A'}
            </div>
            <div className="text-flex-dark-green font-medium">Last Review</div>
          </div>
        </div>
      
        {/* Category Breakdown */}
        {metrics?.categoryAverages && Object.keys(metrics.categoryAverages).length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-flex-beige/50 p-8 mb-12">
            <h3 className="text-2xl font-bold text-flex-green mb-8 text-center">Rating Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Object.entries(metrics.categoryAverages).map(([category, rating]) => (
                <div key={category} className="text-center p-4 bg-flex-beige rounded-xl border border-flex-dark-green/20">
                  <div className="text-2xl font-bold text-flex-green mb-2">
                    {rating.toFixed(1)}
                  </div>
                  <div className="text-sm text-flex-dark-green capitalize mb-3 font-medium">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <StarRating rating={rating / 2} size="sm" className="justify-center" />
                </div>
              ))}
            </div>
          </div>
        )}
      
        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-flex-beige/50 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-2xl font-bold text-flex-green mb-2">
                Guest Reviews
              </h3>
              <p className="text-flex-dark-green">
                {allReviews.length} {allReviews.length === 1 ? 'review' : 'reviews'} from verified guests
                {hostawayReviews.length > 0 && googleReviews.length > 0 && (
                  <span className="text-sm text-flex-dark-green/70 block mt-1">
                    {hostawayReviews.length} from Hostaway • {googleReviews.length} from Google
                  </span>
                )}
              </p>
            </div>
            {allReviews.length > 0 && (
              <div className="flex items-center space-x-2">
                <label className="text-sm text-flex-dark-green font-medium">Sort by:</label>
                <select
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value)}
                  className="px-3 py-2 border border-flex-dark-green/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-flex-green focus:border-flex-green bg-white"
                >
                  <option value="date">Most Recent</option>
                  <option value="rating">Highest Rated</option>
                  <option value="author">By Author</option>
                </select>
              </div>
            )}
          </div>
          
          {allReviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-flex-beige rounded-full p-4 w-16 h-16 mx-auto mb-6 border-2 border-flex-dark-green/20">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-flex-dark-green mx-auto" />
              </div>
              <h4 className="text-xl font-semibold text-flex-green mb-3">No Reviews Yet</h4>
              <p className="text-flex-dark-green max-w-md mx-auto">
                Be the first to experience this beautiful Flex Living property and share your feedback with future guests.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {sortedReviews.map((review) => (
                <div key={review.id} className="border border-flex-beige rounded-xl p-6 bg-flex-cream hover:shadow-lg transition-shadow">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        review.channel === 'google' 
                          ? 'bg-gradient-to-br from-red-500 to-orange-500' 
                          : 'bg-gradient-to-br from-flex-green to-flex-dark-green'
                      }`}>
                        <span className="text-lg font-semibold text-white">
                          {review.authorName?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-flex-green text-lg">
                          {review.authorName}
                          {review.channel === 'google' && review.googleSpecific?.relativeTimeDescription && (
                            <span className="text-sm text-flex-dark-green ml-2">
                              • {review.googleSpecific.relativeTimeDescription}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-flex-dark-green">
                          <span>{format(new Date(review.submittedAt), 'MMMM yyyy')}</span>
                          <span>•</span>
                          <ChannelBadge channel={review.channel} size="sm" />
                          {review.channel === 'google' && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                              Google Reviews
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <StarRating rating={review.ratingOverall5} size="md" showValue={false} />
                      <div className="text-sm text-flex-dark-green mt-1 font-medium">
                        {review.ratingOverall5}/5 stars
                      </div>
                    </div>
                  </div>
                  
                  {/* Review Text */}
                  {review.text && (
                    <div className="mb-4">
                      <p className="text-flex-dark-green leading-relaxed text-lg">
                        "{review.text}"
                      </p>
                    </div>
                  )}
                  
                  {/* Category Ratings */}
                  {Object.keys(review.categories || {}).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(review.categories).map(([category, rating]) => (
                        <span 
                          key={category}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-flex-beige border border-flex-dark-green/30 text-flex-dark-green font-medium"
                        >
                          <span className="capitalize">
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="ml-2 text-flex-green font-semibold">
                            {rating}/10
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Call to Action Footer */}
      <div className="bg-flex-beige border-t border-flex-dark-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-flex-green mb-4">
              Ready to Experience Flex Living?
            </h3>
            <p className="text-flex-dark-green max-w-2xl mx-auto mb-8">
              Discover more premium properties and read authentic reviews from verified guests. 
              Only approved reviews are displayed to ensure quality and authenticity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/properties" 
                className="px-8 py-3 bg-flex-green text-white rounded-lg hover:bg-flex-dark-green transition-colors font-semibold shadow-lg"
              >
                Browse All Properties
              </a>
              <a 
                href="/dashboard" 
                className="px-8 py-3 bg-white text-flex-green border border-flex-dark-green/30 rounded-lg hover:bg-flex-cream transition-colors font-semibold"
              >
                Manage Reviews
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
