/**
 * Convert listing name to URL-friendly slug
 * @param {string} listingName - Original listing name
 * @returns {string} URL slug
 */
export function toListingSlug(listingName) {
  return listingName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Convert 0-10 rating to 0-5 star rating
 * @param {number} rating10 - Rating on 0-10 scale
 * @returns {number} Rating on 0-5 scale
 */
export function toStars5(rating10) {
  if (rating10 === null || rating10 === undefined) return null;
  return Math.round((rating10 / 10) * 5 * 2) / 2; // Round to nearest 0.5
}

/**
 * Compute average rating from category ratings
 * @param {Array} categories - Array of category rating objects
 * @returns {number|null} Average rating on 0-10 scale
 */
function computeAverageRating(categories) {
  if (!categories || categories.length === 0) return null;
  
  const sum = categories.reduce((acc, cat) => acc + (cat.rating || 0), 0);
  return Math.round((sum / categories.length) * 10) / 10; // Round to 1 decimal
}

/**
 * Normalize category data to key-value object
 * @param {Array} reviewCategory - Array of category objects from Hostaway
 * @returns {Object} Normalized category ratings
 */
function normalizeCategories(reviewCategory) {
  if (!reviewCategory || !Array.isArray(reviewCategory)) return {};
  
  const categoryMap = {};
  reviewCategory.forEach(cat => {
    if (cat.category && typeof cat.rating === 'number') {
      // Convert snake_case to camelCase
      const key = cat.category.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
      categoryMap[key] = cat.rating;
    }
  });
  
  return categoryMap;
}

/**
 * Parse and normalize date string to ISO format
 * @param {string} dateString - Date string from API
 * @returns {string} ISO date string
 */
function normalizeDate(dateString) {
  try {
    // Handle Hostaway format: "2020-08-21 22:45:14"
    const date = new Date(dateString.replace(' ', 'T') + 'Z');
    return date.toISOString();
  } catch (error) {
    // Fallback to current date if parsing fails
    console.warn(`Failed to parse date: ${dateString}`);
    return new Date().toISOString();
  }
}

/**
 * Normalize a single Hostaway review
 * @param {Object} review - Raw Hostaway review object
 * @param {Object} approvals - Approval status map
 * @returns {Object} Normalized review object
 */
function normalizeHostawayReview(review, approvals = {}) {
  const categories = normalizeCategories(review.reviewCategory);
  const ratingOverall10 = review.rating || computeAverageRating(review.reviewCategory);
  const ratingOverall5 = toStars5(ratingOverall10);
  
  const normalizedReview = {
    id: `hostaway:${review.id}`,
    channel: 'hostaway',
    reviewType: review.type === 'host-to-guest' ? 'host-to-guest' : 'guest-to-host',
    status: review.status || 'pending',
    ratingOverall10,
    ratingOverall5,
    categories,
    submittedAt: normalizeDate(review.submittedAt),
    authorName: review.guestName || review.hostName || 'Anonymous',
    text: review.publicReview || '',
    approved: approvals[`hostaway:${review.id}`] || false,
    listing: {
      name: review.listingName,
      slug: toListingSlug(review.listingName)
    }
  };
  
  return normalizedReview;
}

/**
 * Compute metrics for a listing's reviews
 * @param {Array} reviews - Array of normalized reviews for the listing
 * @returns {Object} Metrics object
 */
function computeListingMetrics(reviews) {
  if (!reviews || reviews.length === 0) {
    return {
      avgRating5: null,
      avgRating10: null,
      count: 0,
      lastReviewAt: null,
      categoryAverages: {}
    };
  }
  
  // Only include reviews with ratings for average calculation
  const ratedReviews = reviews.filter(r => r.ratingOverall5 !== null);
  
  const avgRating5 = ratedReviews.length > 0 
    ? Math.round((ratedReviews.reduce((sum, r) => sum + r.ratingOverall5, 0) / ratedReviews.length) * 2) / 2
    : null;
    
  const avgRating10 = ratedReviews.length > 0 
    ? Math.round((ratedReviews.reduce((sum, r) => sum + r.ratingOverall10, 0) / ratedReviews.length) * 10) / 10
    : null;
  
  // Find most recent review
  const lastReviewAt = reviews.reduce((latest, review) => {
    const reviewDate = new Date(review.submittedAt);
    return reviewDate > new Date(latest) ? review.submittedAt : latest;
  }, reviews[0].submittedAt);
  
  // Calculate category averages
  const categoryAverages = {};
  const categoryTotals = {};
  const categoryCounts = {};
  
  reviews.forEach(review => {
    Object.entries(review.categories).forEach(([category, rating]) => {
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
        categoryCounts[category] = 0;
      }
      categoryTotals[category] += rating;
      categoryCounts[category]++;
    });
  });
  
  Object.keys(categoryTotals).forEach(category => {
    categoryAverages[category] = Math.round((categoryTotals[category] / categoryCounts[category]) * 10) / 10;
  });
  
  return {
    avgRating5,
    avgRating10,
    count: reviews.length,
    lastReviewAt,
    categoryAverages
  };
}

/**
 * Normalize raw Hostaway API response
 * @param {Object} rawData - Raw Hostaway API response
 * @param {Object} approvals - Approval status map
 * @returns {Object} Normalized response with listings and reviews
 */
export function normalizeHostaway(rawData, approvals = {}) {
  if (!rawData || !rawData.result || !Array.isArray(rawData.result)) {
    return {
      source: 'hostaway',
      fetchedAt: new Date().toISOString(),
      listings: []
    };
  }
  
  // Normalize all reviews
  const normalizedReviews = rawData.result.map(review => 
    normalizeHostawayReview(review, approvals)
  );
  
  // Group by listing
  const listingsMap = new Map();
  
  normalizedReviews.forEach(review => {
    const listingSlug = review.listing.slug;
    
    if (!listingsMap.has(listingSlug)) {
      listingsMap.set(listingSlug, {
        listingId: listingSlug,
        listingName: review.listing.name,
        reviews: []
      });
    }
    
    listingsMap.get(listingSlug).reviews.push(review);
  });
  
  // Compute metrics for each listing
  const listings = Array.from(listingsMap.values()).map(listing => ({
    ...listing,
    metrics: computeListingMetrics(listing.reviews)
  }));
  
  return {
    source: 'hostaway',
    fetchedAt: new Date().toISOString(),
    listings
  };
}
