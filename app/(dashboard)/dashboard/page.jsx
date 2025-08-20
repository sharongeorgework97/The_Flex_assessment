'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertySummaryCards from '@/components/PropertySummaryCards';
import FiltersBar from '@/components/FiltersBar';
import ReviewTable from '@/components/ReviewTable';
import { bucketizeByDate } from '@/lib/analytics';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Initialize filters from URL search params
  const [filters, setFilters] = useState(() => {
    const initialFilters = {};
    for (const [key, value] of searchParams.entries()) {
      if (key === 'ratingMin' || key === 'ratingMax') {
        initialFilters[key] = parseFloat(value);
      } else if (key === 'approved') {
        initialFilters[key] = value === 'true';
      } else {
        initialFilters[key] = value;
      }
    }
    return initialFilters;
  });
  
  const [selectedProperty, setSelectedProperty] = useState(filters.listingId || null);
  
  // Fetch data from API
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await fetch(`/api/reviews/hostaway?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchData();
  }, [filters]);
  
  // Update URL when filters change
  useEffect(() => {
    const url = new URL(window.location);
    url.search = '';
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        url.searchParams.set(key, value.toString());
      }
    });
    
    window.history.replaceState({}, '', url.toString());
  }, [filters]);
  
  // Memoized computations
  const { allReviews, trendsData } = useMemo(() => {
    if (!data || !data.listings) {
      return { allReviews: [], trendsData: [] };
    }
    
    // Flatten all reviews
    const allReviews = [];
    data.listings.forEach(listing => {
      listing.reviews.forEach(review => {
        allReviews.push(review);
      });
    });
    
    // Calculate trends data for each listing
    const trendsData = data.listings.map(listing => ({
      listingId: listing.listingId,
      data: bucketizeByDate(listing.reviews, 'submittedAt', 'day', 30)
    }));
    
    return { allReviews, trendsData };
  }, [data]);
  
  // Handlers
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  const handlePropertySelect = (propertyId) => {
    if (selectedProperty === propertyId) {
      // Deselect if clicking the same property
      setSelectedProperty(null);
      const newFilters = { ...filters };
      delete newFilters.listingId;
      setFilters(newFilters);
    } else {
      // Select new property
      setSelectedProperty(propertyId);
      setFilters({ ...filters, listingId: propertyId });
    }
  };
  
  const handleApprovalChange = async (reviewId, approved) => {
    // Optimistically update the local state
    if (data) {
      const updatedListings = data.listings.map(listing => ({
        ...listing,
        reviews: listing.reviews.map(review =>
          review.id === reviewId ? { ...review, approved } : review
        )
      }));
      
      setData({ ...data, listings: updatedListings });
    }
  };
  
  const handleReviewClick = (review) => {
    // Could open a detailed view modal or navigate to review details
    console.log('Review clicked:', review);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Loading state
  if (isLoading && !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Reviews</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reviews Dashboard
        </h1>
        <p className="text-gray-600">
          Manage reviews across all properties, approve content for public display, and analyze performance.
        </p>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">
            {data?.listings?.length || 0}
          </div>
          <div className="text-sm text-gray-500">Properties</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">
            {allReviews.length}
          </div>
          <div className="text-sm text-gray-500">Total Reviews</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {allReviews.filter(r => r.approved).length}
          </div>
          <div className="text-sm text-gray-500">Approved</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {allReviews.filter(r => !r.approved).length}
          </div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
      </div>
      
      {/* Property Summary Cards */}
      {data?.listings && data.listings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            All Available properties
          </h2>
          <PropertySummaryCards
            listings={data.listings}
            trendsData={trendsData}
            onPropertySelect={handlePropertySelect}
            selectedProperty={selectedProperty}
          />
        </div>
      )}
      
      {/* Filters */}
      <FiltersBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        listings={data?.listings || []}
        isLoading={isLoading}
      />
      
      {/* Reviews Table */}
      <ReviewTable
        reviews={allReviews}
        isLoading={isLoading}
        onApprovalChange={handleApprovalChange}
        onReviewClick={handleReviewClick}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
      
      {/* Refresh Button */}
      <div className="mt-8 text-center">
        <button
          onClick={fetchData}
          disabled={isLoading}
          className="btn btn-secondary"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Last updated: {data?.fetchedAt ? new Date(data.fetchedAt).toLocaleString() : 'Never'}
        </p>
      </div>
    </div>
  );
}
