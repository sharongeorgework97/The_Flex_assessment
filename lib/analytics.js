import { format, startOfDay, startOfWeek, startOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';

/**
 * Compute metrics for a set of reviews
 * @param {Array} reviews - Array of normalized reviews
 * @returns {Object} Computed metrics
 */
export function computeListingMetrics(reviews) {
  if (!reviews || reviews.length === 0) {
    return {
      count: 0,
      avgRating5: null,
      avgRating10: null,
      lastReviewAt: null,
      categoryAverages: {},
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  // Filter reviews with ratings for average calculations
  const ratedReviews = reviews.filter(r => r.ratingOverall5 !== null && r.ratingOverall5 !== undefined);
  
  // Calculate average ratings
  const avgRating5 = ratedReviews.length > 0 
    ? Math.round((ratedReviews.reduce((sum, r) => sum + r.ratingOverall5, 0) / ratedReviews.length) * 2) / 2
    : null;
    
  const avgRating10 = ratedReviews.length > 0 
    ? Math.round((ratedReviews.reduce((sum, r) => sum + r.ratingOverall10, 0) / ratedReviews.length) * 10) / 10
    : null;

  // Find most recent review
  const sortedByDate = reviews.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  const lastReviewAt = sortedByDate.length > 0 ? sortedByDate[0].submittedAt : null;

  // Calculate category averages
  const categoryTotals = {};
  const categoryCounts = {};

  reviews.forEach(review => {
    Object.entries(review.categories || {}).forEach(([category, rating]) => {
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
        categoryCounts[category] = 0;
      }
      categoryTotals[category] += rating;
      categoryCounts[category]++;
    });
  });

  const categoryAverages = {};
  Object.keys(categoryTotals).forEach(category => {
    categoryAverages[category] = Math.round((categoryTotals[category] / categoryCounts[category]) * 10) / 10;
  });

  // Calculate rating distribution
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratedReviews.forEach(review => {
    const rounded = Math.round(review.ratingOverall5);
    if (rounded >= 1 && rounded <= 5) {
      ratingDistribution[rounded]++;
    }
  });

  return {
    count: reviews.length,
    avgRating5,
    avgRating10,
    lastReviewAt,
    categoryAverages,
    ratingDistribution
  };
}

/**
 * Bucketize reviews by date period
 * @param {Array} reviews - Array of reviews
 * @param {string} dateField - Field name containing the date
 * @param {string} period - 'day', 'week', or 'month'
 * @param {number} maxBuckets - Maximum number of buckets to return
 * @returns {Array} Array of bucket objects with date and count
 */
export function bucketizeByDate(reviews, dateField = 'submittedAt', period = 'day', maxBuckets = 30) {
  if (!reviews || reviews.length === 0) return [];

  const now = new Date();
  const dates = reviews.map(r => new Date(r[dateField])).sort((a, b) => a - b);
  const oldestDate = dates[0];
  const newestDate = dates[dates.length - 1];

  let intervals;
  let startFn;
  let formatStr;

  switch (period) {
    case 'week':
      startFn = startOfWeek;
      formatStr = 'MMM dd';
      intervals = eachWeekOfInterval({ start: oldestDate, end: newestDate });
      break;
    case 'month':
      startFn = startOfMonth;
      formatStr = 'MMM yyyy';
      intervals = eachMonthOfInterval({ start: oldestDate, end: newestDate });
      break;
    case 'day':
    default:
      startFn = startOfDay;
      formatStr = 'MMM dd';
      intervals = eachDayOfInterval({ start: oldestDate, end: newestDate });
      break;
  }

  // Limit intervals to maxBuckets
  if (intervals.length > maxBuckets) {
    intervals = intervals.slice(-maxBuckets);
  }

  // Create buckets
  const buckets = intervals.map(intervalStart => {
    const label = format(intervalStart, formatStr);
    const count = reviews.filter(review => {
      const reviewDate = new Date(review[dateField]);
      const bucketStart = startFn(intervalStart);
      const nextInterval = new Date(bucketStart);
      
      switch (period) {
        case 'week':
          nextInterval.setDate(nextInterval.getDate() + 7);
          break;
        case 'month':
          nextInterval.setMonth(nextInterval.getMonth() + 1);
          break;
        case 'day':
        default:
          nextInterval.setDate(nextInterval.getDate() + 1);
          break;
      }
      
      return reviewDate >= bucketStart && reviewDate < nextInterval;
    }).length;

    const avgRating = reviews
      .filter(review => {
        const reviewDate = new Date(review[dateField]);
        const bucketStart = startFn(intervalStart);
        const nextInterval = new Date(bucketStart);
        
        switch (period) {
          case 'week':
            nextInterval.setDate(nextInterval.getDate() + 7);
            break;
          case 'month':
            nextInterval.setMonth(nextInterval.getMonth() + 1);
            break;
          case 'day':
          default:
            nextInterval.setDate(nextInterval.getDate() + 1);
            break;
        }
        
        return reviewDate >= bucketStart && reviewDate < nextInterval && review.ratingOverall5 !== null;
      })
      .reduce((acc, review, _, arr) => {
        if (arr.length === 0) return null;
        return acc + review.ratingOverall5 / arr.length;
      }, 0);

    return {
      date: intervalStart.toISOString(),
      label,
      count,
      avgRating: avgRating ? Math.round(avgRating * 2) / 2 : null
    };
  });

  return buckets;
}

/**
 * Calculate average category scores across multiple reviews
 * @param {Array} reviews - Array of reviews
 * @returns {Object} Average scores per category
 */
export function averageCategoryScores(reviews) {
  if (!reviews || reviews.length === 0) return {};

  const categoryTotals = {};
  const categoryCounts = {};

  reviews.forEach(review => {
    Object.entries(review.categories || {}).forEach(([category, rating]) => {
      if (typeof rating === 'number') {
        categoryTotals[category] = (categoryTotals[category] || 0) + rating;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });
  });

  const averages = {};
  Object.keys(categoryTotals).forEach(category => {
    averages[category] = Math.round((categoryTotals[category] / categoryCounts[category]) * 10) / 10;
  });

  return averages;
}

/**
 * Apply filters to reviews array
 * @param {Array} reviews - Array of reviews to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered reviews
 */
export function applyFilters(reviews, filters = {}) {
  if (!reviews || reviews.length === 0) return [];

  let filtered = [...reviews];

  // Filter by listing
  if (filters.listingId) {
    filtered = filtered.filter(review => 
      review.listing?.slug === filters.listingId
    );
  }

  // Filter by channel
  if (filters.channel) {
    filtered = filtered.filter(review => review.channel === filters.channel);
  }

  // Filter by rating range
  if (filters.ratingMin !== undefined) {
    filtered = filtered.filter(review => 
      review.ratingOverall5 !== null && review.ratingOverall5 >= filters.ratingMin
    );
  }

  if (filters.ratingMax !== undefined) {
    filtered = filtered.filter(review => 
      review.ratingOverall5 !== null && review.ratingOverall5 <= filters.ratingMax
    );
  }

  // Filter by category
  if (filters.category) {
    filtered = filtered.filter(review => 
      review.categories && review.categories[filters.category] !== undefined
    );
  }

  // Filter by date range
  if (filters.from) {
    const fromDate = new Date(filters.from);
    filtered = filtered.filter(review => 
      new Date(review.submittedAt) >= fromDate
    );
  }

  if (filters.to) {
    const toDate = new Date(filters.to);
    toDate.setHours(23, 59, 59, 999); // End of day
    filtered = filtered.filter(review => 
      new Date(review.submittedAt) <= toDate
    );
  }

  // Filter by approval status
  if (filters.approved !== undefined) {
    filtered = filtered.filter(review => review.approved === filters.approved);
  }

  // Text search
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(review =>
      review.text?.toLowerCase().includes(searchTerm) ||
      review.authorName?.toLowerCase().includes(searchTerm) ||
      review.listing?.name?.toLowerCase().includes(searchTerm)
    );
  }

  return filtered;
}

/**
 * Sort reviews by specified criteria
 * @param {Array} reviews - Array of reviews to sort
 * @param {string} sortBy - Sort field ('rating', 'date', 'author', etc.)
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted reviews
 */
export function sortReviews(reviews, sortBy = 'date', direction = 'desc') {
  if (!reviews || reviews.length === 0) return [];

  const sorted = [...reviews];

  sorted.sort((a, b) => {
    let aVal, bVal;

    switch (sortBy) {
      case 'rating':
        aVal = a.ratingOverall5 || 0;
        bVal = b.ratingOverall5 || 0;
        break;
      case 'date':
        aVal = new Date(a.submittedAt);
        bVal = new Date(b.submittedAt);
        break;
      case 'author':
        aVal = a.authorName?.toLowerCase() || '';
        bVal = b.authorName?.toLowerCase() || '';
        break;
      case 'listing':
        aVal = a.listing?.name?.toLowerCase() || '';
        bVal = b.listing?.name?.toLowerCase() || '';
        break;
      case 'channel':
        aVal = a.channel || '';
        bVal = b.channel || '';
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}
