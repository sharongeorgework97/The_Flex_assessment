'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import StarRating from '@/components/StarRating';
import { HomeIcon, MapPinIcon, UserGroupIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [propertiesData, setPropertiesData] = useState(null);
  const [listingsData, setListingsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState('all');
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all reviews to get metrics per property
        const reviewsResponse = await fetch('/api/reviews/hostaway?approved=true');
        const reviewsData = await reviewsResponse.json();
        
        // Fetch listings metadata
        const listingsResponse = await fetch('/api/listings');
        const listingsData = await listingsResponse.json();
        
        setPropertiesData(reviewsData);
        setListingsData(listingsData);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch properties data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Set selected city from URL parameter
  useEffect(() => {
    const cityParam = searchParams.get('city');
    if (cityParam) {
      setSelectedCity(cityParam);
    }
  }, [searchParams]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <div className="text-red-500 mb-4">
            <HomeIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Properties</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  const listings = propertiesData?.listings || [];
  
  // Filter properties by selected city
  const filteredListings = selectedCity === 'all' 
    ? listings 
    : listings.filter(listing => {
        const propertyInfo = listingsData?.find(l => l.slug === listing.listingId);
        return propertyInfo?.city === selectedCity;
      });
  
  // Get unique cities from listings
  const cities = [...new Set(listingsData?.map(l => l.city).filter(Boolean) || [])];
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-flex-green mb-2">
          Properties
        </h1>
        <p className="text-flex-dark-green">
          Browse all Flex Living properties and read guest reviews.
        </p>
      </div>
      
      {/* City Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setSelectedCity('all')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedCity === 'all'
                ? 'bg-flex-green text-white'
                : 'bg-white text-flex-green border-2 border-flex-green hover:bg-flex-beige'
            }`}
          >
            All Cities
          </button>
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCity === city
                  ? 'bg-flex-green text-white'
                  : 'bg-white text-flex-green border-2 border-flex-green hover:bg-flex-beige'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
      
      {/* Properties Grid */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg text-center py-12">
          <BuildingOfficeIcon className="h-12 w-12 mx-auto text-flex-dark-green mb-4" />
          <h3 className="text-lg font-medium text-flex-green mb-2">
            {selectedCity === 'all' ? 'No Properties Found' : `No Properties in ${selectedCity}`}
          </h3>
          <p className="text-flex-dark-green">
            {selectedCity === 'all' 
              ? 'No properties with reviews are currently available.'
              : `No properties with reviews are currently available in ${selectedCity}.`
            }
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => {
            const listingInfo = listingsData?.find(l => l.slug === listing.listingId);
            const approvedReviews = listing.reviews?.filter(r => r.approved) || [];
            const metrics = listing.metrics;
            
            return (
              <Link
                key={listing.listingId}
                href={`/properties/${listing.listingId}`}
                className="block"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full border border-flex-beige">
                  {/* Property Image Placeholder */}
                  <div className="bg-gradient-to-br from-flex-green to-flex-dark-green rounded-t-2xl h-48 mb-4 flex items-center justify-center">
                    <HomeIcon className="h-12 w-12 text-white opacity-80" />
                  </div>
                  
                  {/* Property Info */}
                  <div className="flex-1 p-6">
                    <h3 className="text-lg font-semibold text-flex-green mb-2 line-clamp-2">
                      {listing.listingName}
                    </h3>
                    
                    {listingInfo?.address && (
                      <div className="flex items-center text-flex-dark-green mb-2">
                        <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">{listingInfo.area}, {listingInfo.city}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-flex-dark-green mb-4">
                      {listingInfo?.type && (
                        <div className="flex items-center">
                          <HomeIcon className="h-4 w-4 mr-1" />
                          <span className="capitalize">{listingInfo.type}</span>
                        </div>
                      )}
                      {listingInfo?.bedrooms !== undefined && (
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1" />
                          <span>
                            {listingInfo.bedrooms === 0 ? 'Studio' : `${listingInfo.bedrooms}BR`}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Rating and Reviews */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {metrics?.avgRating5 ? (
                          <>
                            <StarRating rating={metrics.avgRating5} size="sm" />
                            <span className="text-sm font-medium text-flex-green">
                              {metrics.avgRating5.toFixed(1)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-flex-dark-green">No rating yet</span>
                        )}
                      </div>
                      <div className="text-sm text-flex-dark-green">
                        {approvedReviews.length} {approvedReviews.length === 1 ? 'review' : 'reviews'}
                      </div>
                    </div>
                    
                    {/* Performance Indicator */}
                    <div className="mt-3 pt-3 border-t border-flex-beige">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-flex-dark-green">Performance</span>
                        <div className="flex items-center space-x-1">
                          {metrics?.avgRating5 >= 4.5 ? (
                            <>
                              <div className="h-2 w-2 bg-flex-green rounded-full"></div>
                              <span className="text-xs text-flex-green font-medium">Excellent</span>
                            </>
                          ) : metrics?.avgRating5 >= 4.0 ? (
                            <>
                              <div className="h-2 w-2 bg-flex-dark-green rounded-full"></div>
                              <span className="text-xs text-flex-dark-green font-medium">Good</span>
                            </>
                          ) : metrics?.avgRating5 >= 3.0 ? (
                            <>
                              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                              <span className="text-xs text-yellow-600 font-medium">Fair</span>
                            </>
                          ) : metrics?.avgRating5 > 0 ? (
                            <>
                              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                              <span className="text-xs text-red-600 font-medium">Needs Attention</span>
                            </>
                          ) : (
                            <>
                              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                              <span className="text-xs text-gray-600 font-medium">No Rating</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-12 text-center">
        <div className="card bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Manage Reviews
          </h3>
          <p className="text-gray-600 mb-4">
            Are you a property manager? Access the dashboard to approve reviews and analyze performance.
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
