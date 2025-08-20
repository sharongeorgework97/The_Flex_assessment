'use client';

import { useState } from 'react';
import { ChevronDownIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ChannelBadge from './ChannelBadge';

/**
 * FiltersBar component for filtering reviews
 * @param {Object} props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFiltersChange - Callback when filters change
 * @param {Array} props.listings - Available listings for filtering
 * @param {boolean} props.isLoading - Whether data is loading
 */
export default function FiltersBar({ 
  filters = {}, 
  onFiltersChange,
  listings = [],
  isLoading = false 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Available filter options
  const channels = ['hostaway', 'google', 'airbnb', 'booking'];
  const categories = [
    'cleanliness',
    'communication', 
    'location',
    'value',
    'checkIn',
    'accuracy',
    'respectHouseRules'
  ];
  
  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'rating', label: 'Rating' },
    { value: 'author', label: 'Author' },
    { value: 'listing', label: 'Property' },
    { value: 'channel', label: 'Channel' }
  ];
  
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters };
    
    if (value === '' || value === null || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    
    onFiltersChange && onFiltersChange(newFilters);
  };
  
  const clearFilters = () => {
    onFiltersChange && onFiltersChange({});
  };
  
  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key] !== null && filters[key] !== undefined && filters[key] !== ''
  ).length;
  
  return (
    <div className="filter-bar">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="badge badge-primary">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Clear all</span>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="sm:hidden btn btn-secondary btn-sm flex items-center space-x-1"
          >
            <span>{isExpanded ? 'Hide' : 'Show'} filters</span>
            <ChevronDownIcon className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Filter Controls */}
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden sm:block'}`}>
        {/* Row 1: Search, Property, Channel */}
        <div className="filter-row">
          {/* Search */}
          <div className="filter-group flex-1 min-w-0">
            <label className="form-label">Search</label>
            <input
              type="text"
              placeholder="Search reviews, authors, properties..."
              className="form-input"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          {/* Property Filter */}
          <div className="filter-group w-full sm:w-64">
            <label className="form-label">Property</label>
            <select
              className="form-select"
              value={filters.listingId || ''}
              onChange={(e) => handleFilterChange('listingId', e.target.value)}
              disabled={isLoading}
            >
              <option value="">All properties</option>
              {listings.map(listing => (
                <option key={listing.listingId} value={listing.listingId}>
                  {listing.listingName}
                </option>
              ))}
            </select>
          </div>
          
          {/* Channel Filter */}
          <div className="filter-group w-full sm:w-48">
            <label className="form-label">Channel</label>
            <select
              className="form-select"
              value={filters.channel || ''}
              onChange={(e) => handleFilterChange('channel', e.target.value)}
              disabled={isLoading}
            >
              <option value="">All channels</option>
              {channels.map(channel => (
                <option key={channel} value={channel}>
                  {channel.charAt(0).toUpperCase() + channel.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Row 2: Date Range, Rating Range */}
        <div className="filter-row">
          {/* Date Range */}
          <div className="filter-group flex-1">
            <label className="form-label">Date Range</label>
            <div className="flex space-x-2">
              <input
                type="date"
                className="form-input flex-1"
                value={filters.from || ''}
                onChange={(e) => handleFilterChange('from', e.target.value)}
                disabled={isLoading}
                placeholder="From"
              />
              <input
                type="date"
                className="form-input flex-1"
                value={filters.to || ''}
                onChange={(e) => handleFilterChange('to', e.target.value)}
                disabled={isLoading}
                placeholder="To"
              />
            </div>
          </div>
          
          {/* Rating Range */}
          <div className="filter-group w-full sm:w-64">
            <label className="form-label">Rating Range</label>
            <div className="flex space-x-2 items-center">
              <input
                type="number"
                min="0"
                max="5"
                step="0.5"
                className="form-input flex-1"
                placeholder="Min"
                value={filters.ratingMin || ''}
                onChange={(e) => handleFilterChange('ratingMin', e.target.value ? parseFloat(e.target.value) : null)}
                disabled={isLoading}
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                min="0"
                max="5"
                step="0.5"
                className="form-input flex-1"
                placeholder="Max"
                value={filters.ratingMax || ''}
                onChange={(e) => handleFilterChange('ratingMax', e.target.value ? parseFloat(e.target.value) : null)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
        
        {/* Row 3: Category, Approval Status, Sort */}
        <div className="filter-row">
          {/* Category Filter */}
          <div className="filter-group w-full sm:w-48">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              disabled={isLoading}
            >
              <option value="">All categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          
          {/* Approval Status */}
          <div className="filter-group w-full sm:w-48">
            <label className="form-label">Approval Status</label>
            <select
              className="form-select"
              value={filters.approved !== undefined ? filters.approved.toString() : ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  handleFilterChange('approved', undefined);
                } else {
                  handleFilterChange('approved', value === 'true');
                }
              }}
              disabled={isLoading}
            >
              <option value="">All reviews</option>
              <option value="true">Approved only</option>
              <option value="false">Pending only</option>
            </select>
          </div>
          
          {/* Sort */}
          <div className="filter-group flex-1">
            <label className="form-label">Sort by</label>
            <div className="flex space-x-2">
              <select
                className="form-select flex-1"
                value={filters.sort || 'date'}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                disabled={isLoading}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                className="form-select w-20"
                value={filters.dir || 'desc'}
                onChange={(e) => handleFilterChange('dir', e.target.value)}
                disabled={isLoading}
              >
                <option value="desc">↓</option>
                <option value="asc">↑</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.listingId && (
              <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                <span>Property: {listings.find(l => l.listingId === filters.listingId)?.listingName || filters.listingId}</span>
                <button onClick={() => handleFilterChange('listingId', null)}>
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            )}
            {filters.channel && (
              <div className="flex items-center space-x-1">
                <ChannelBadge channel={filters.channel} size="sm" />
                <button onClick={() => handleFilterChange('channel', null)}>
                  <XMarkIcon className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            )}
            {(filters.ratingMin || filters.ratingMax) && (
              <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                <span>
                  Rating: {filters.ratingMin || 0}★ - {filters.ratingMax || 5}★
                </span>
                <button onClick={() => {
                  handleFilterChange('ratingMin', null);
                  handleFilterChange('ratingMax', null);
                }}>
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
