'use client';

import StarRating from './StarRating';
import TrendSparkline from './TrendSparkline';
import { format } from 'date-fns';

/**
 * PropertySummaryCards component displays summary cards for each property
 * @param {Object} props
 * @param {Array} props.listings - Array of listing objects with reviews and metrics
 * @param {Array} props.trendsData - Array of trend data for sparklines
 * @param {Function} props.onPropertySelect - Callback when a property is selected
 * @param {string} props.selectedProperty - Currently selected property ID
 */
export default function PropertySummaryCards({ 
  listings = [], 
  trendsData = [],
  onPropertySelect,
  selectedProperty 
}) {
  if (!listings || listings.length === 0) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => {
        const { metrics } = listing;
        const isSelected = selectedProperty === listing.listingId;
        const listingTrends = trendsData.find(t => t.listingId === listing.listingId)?.data || [];
        
        // Calculate additional metrics
        const approvedCount = listing.reviews?.filter(r => r.approved).length || 0;
        const pendingCount = (listing.reviews?.length || 0) - approvedCount;
        
        return (
          <div 
            key={listing.listingId}
            className={`card cursor-pointer transition-all hover:shadow-lg ${
              isSelected ? 'ring-2 ring-flex-blue shadow-lg' : ''
            }`}
            onClick={() => onPropertySelect && onPropertySelect(listing.listingId)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {listing.listingName}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {listing.listingId}
                </p>
              </div>
              {isSelected && (
                <div className="ml-2 h-2 w-2 bg-flex-blue rounded-full"></div>
              )}
            </div>
            
            {/* Rating and Review Count */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <StarRating 
                  rating={metrics.avgRating5} 
                  size="md" 
                  showValue={true}
                />
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {metrics.count || 0}
                </div>
                <div className="text-xs text-gray-500">
                  {metrics.count === 1 ? 'review' : 'reviews'}
                </div>
              </div>
            </div>
            
            {/* Approval Status */}
            <div className="flex items-center justify-between mb-4 text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">{approvedCount} approved</span>
                </div>
                {pendingCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">{pendingCount} pending</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Last Review Date */}
            {metrics.lastReviewAt && (
              <div className="mb-4">
                <div className="text-xs text-gray-500">
                  Last review: {format(new Date(metrics.lastReviewAt), 'MMM dd, yyyy')}
                </div>
              </div>
            )}
            
            {/* Trend Sparkline */}
            {listingTrends.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">30-day trend</span>
                  <span className="text-xs text-gray-400">Reviews</span>
                </div>
                <TrendSparkline 
                  data={listingTrends}
                  metric="count"
                  width={200}
                  height={32}
                  color="#0066CC"
                />
              </div>
            )}
            
            {/* Category Highlights */}
            {metrics.categoryAverages && Object.keys(metrics.categoryAverages).length > 0 && (
              <div>
                <div className="text-xs text-gray-500 mb-2">Top categories</div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(metrics.categoryAverages)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3)
                    .map(([category, rating]) => (
                      <div 
                        key={category}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                      >
                        <span className="capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="ml-1 font-medium">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
            
            {/* Performance Indicator */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Performance</span>
                <div className="flex items-center space-x-1">
                  {metrics.avgRating5 >= 4.5 ? (
                    <>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">Excellent</span>
                    </>
                  ) : metrics.avgRating5 >= 4.0 ? (
                    <>
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-blue-600 font-medium">Good</span>
                    </>
                  ) : metrics.avgRating5 >= 3.0 ? (
                    <>
                      <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-yellow-600 font-medium">Fair</span>
                    </>
                  ) : metrics.avgRating5 > 0 ? (
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
        );
      })}
    </div>
  );
}
