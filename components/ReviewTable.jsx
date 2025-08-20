'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import StarRating from './StarRating';
import ChannelBadge from './ChannelBadge';
import ApproveToggle from './ApproveToggle';
import { EyeIcon, EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Info } from "lucide-react";


/**
 * ReviewTable component displays reviews in a table format
 * @param {Object} props
 * @param {Array} props.reviews - Array of review objects
 * @param {boolean} props.isLoading - Whether data is loading
 * @param {Function} props.onApprovalChange - Callback when approval status changes
 * @param {Function} props.onReviewClick - Callback when a review is clicked
 * @param {number} props.currentPage - Current page number
 * @param {number} props.itemsPerPage - Items per page
 * @param {Function} props.onPageChange - Callback when page changes
 */
export default function ReviewTable({ 
  reviews = [], 
  isLoading = false,
  onApprovalChange,
  onReviewClick,
  currentPage = 1,
  itemsPerPage = 20,
  onPageChange
}) {
  const [expandedReview, setExpandedReview] = useState(null);
  const [openInfo, setOpenInfo] = useState(false);
  
  // Pagination
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReviews = reviews.slice(startIndex, endIndex);
  
  const handleApprovalToggle = (reviewId, approved) => {
    onApprovalChange && onApprovalChange(reviewId, approved);
  };
  
  const toggleExpandReview = (reviewId) => {
    setExpandedReview(expandedReview === reviewId ? null : reviewId);
  };
  
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className="card text-center py-8">
        <div className="text-gray-500">
          <EyeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No reviews found</h3>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      </div>
    );
  }
  // export default function ReviewsHeader({ reviews, totalPages, startIndex, endIndex }) {
  // const [open, setOpen] = useState(false)
  
  // return (
  // <div className="card">
  //   {/* Table Header */}
  //   <div className="flex items-center justify-between mb-6">
  //     <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
  //       Reviews ({reviews.length})

  //       {/* Info icon with modal */}
  //       <Dialog>
  //         <DialogTrigger asChild>
  //           <Info className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
  //         </DialogTrigger>
  //         <DialogContent className="sm:max-w-md">
  //           <DialogHeader>
  //             <DialogTitle>About Reviews</DialogTitle>
  //           </DialogHeader>
  //           <div className="text-sm text-gray-600 space-y-2">
  //             <p>
  //               This number represents the total reviews fetched from the system.
  //             </p>
  //             <p>
  //               You can apply filters (like rating, date range, or approval status) 
  //               to refine which reviews are displayed in the table.
  //             </p>
  //           </div>
  //         </DialogContent>
  //       </Dialog>
  //     </h3>

  //     {totalPages > 1 && (
  //       <div className="text-sm text-gray-500">
  //         Showing {startIndex + 1}-{Math.min(endIndex, reviews.length)} of {reviews.length}
  //       </div>
  //     )}
  //   </div>
  return (
    <div className="card">
      {/* Table Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          Reviews ({reviews.length})
          <Info
            className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={() => setOpenInfo(true)}
          />
        </h3>

        {totalPages > 1 && (
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, reviews.length)} of {reviews.length}
          </div>
        )}
      </div>

      {/* Custom Modal */}
      {openInfo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold mb-2">About Reviews</h2>
            <p className="text-sm text-gray-600">
              Managers can approve or reject reviews in this section. Only approved reviews for 
              selected properties will appear on the properties page.
            </p>
            <button
              onClick={() => setOpenInfo(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Approval</th>
              <th className="table-header-cell">Date</th>
              <th className="table-header-cell">Property</th>
              <th className="table-header-cell">Channel</th>
              <th className="table-header-cell">Rating</th>
              <th className="table-header-cell">Categories</th>
              <th className="table-header-cell">Review</th>
              <th className="table-header-cell">Author</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {paginatedReviews.map((review) => (
              <tr key={review.id} className="hover:bg-gray-50">
                <td className="table-cell">
                  <ApproveToggle
                    reviewId={review.id}
                    approved={review.approved}
                    onToggle={handleApprovalToggle}
                    size="sm"
                  />
                </td>
                <td className="table-cell">
                  <div className="text-sm text-gray-900">
                    {format(new Date(review.submittedAt), 'MMM dd, yyyy')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(review.submittedAt), 'h:mm a')}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                    {review.listing?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {review.listing?.slug}
                  </div>
                </td>
                <td className="table-cell">
                  <ChannelBadge channel={review.channel} size="sm" />
                </td>
                <td className="table-cell">
                  <StarRating 
                    rating={review.ratingOverall5} 
                    size="sm" 
                    showValue={false}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {review.ratingOverall5 ? `${review.ratingOverall5}/5` : 'No rating'}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {Object.entries(review.categories || {}).slice(0, 3).map(([category, rating]) => (
                      <span 
                        key={category}
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                      >
                        {category.replace(/([A-Z])/g, ' $1').trim()}: {rating}
                      </span>
                    ))}
                    {Object.keys(review.categories || {}).length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{Object.keys(review.categories).length - 3} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="table-cell max-w-lg break-words whitespace-normal align-top">
                  <div className="max-w-xs">
                    <p className="text-sm text-gray-900">
                      {truncateText(review.text, 80)}
                    </p>
                    {review.text && review.text.length > 80 && (
                      <button
                        onClick={() => toggleExpandReview(review.id)}
                        className="text-xs text-flex-blue hover:text-blue-700 mt-1"
                      >
                        {expandedReview === review.id ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="text-sm text-gray-900">
                    {review.authorName}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {review.reviewType?.replace('-', ' ')}
                  </div>
                </td>
                <td className="table-cell">
                  <button
                    onClick={() => onReviewClick && onReviewClick(review)}
                    className="text-gray-400 hover:text-gray-600"
                    title="View details"
                  >
                    <EllipsisHorizontalIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {paginatedReviews.map((review) => (
          <div key={review.id} className="border border-gray-200 rounded-lg p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <ChannelBadge channel={review.channel} size="sm" />
                  <span className="text-xs text-gray-500">
                    {format(new Date(review.submittedAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {review.listing?.name}
                </h4>
              </div>
              <ApproveToggle
                reviewId={review.id}
                approved={review.approved}
                onToggle={handleApprovalToggle}
                size="sm"
              />
            </div>
            
            {/* Rating and Author */}
            <div className="flex items-center justify-between mb-3">
              <StarRating 
                rating={review.ratingOverall5} 
                size="sm" 
                showValue={true}
              />
              <div className="text-right">
                <div className="text-sm text-gray-900">{review.authorName}</div>
                <div className="text-xs text-gray-500 capitalize">
                  {review.reviewType?.replace('-', ' ')}
                </div>
              </div>
            </div>
            
            {/* Review Text */}
            {review.text && (
              <div className="mb-3">
                <p className="text-sm text-gray-700">
                  {expandedReview === review.id ? review.text : truncateText(review.text, 120)}
                </p>
                {review.text.length > 120 && (
                  <button
                    onClick={() => toggleExpandReview(review.id)}
                    className="text-xs text-flex-blue hover:text-blue-700 mt-1"
                  >
                    {expandedReview === review.id ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            )}
            
            {/* Categories */}
            {Object.keys(review.categories || {}).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {Object.entries(review.categories).map(([category, rating]) => (
                  <span 
                    key={category}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
                  >
                    {category.replace(/([A-Z])/g, ' $1').trim()}: {rating}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Expanded Review Modal */}
      {expandedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-medium">Review Details</h3>
                <button
                  onClick={() => setExpandedReview(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              {(() => {
                const review = reviews.find(r => r.id === expandedReview);
                return review ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <ChannelBadge channel={review.channel} />
                      <StarRating rating={review.ratingOverall5} showValue={true} />
                      <span className="text-sm text-gray-500">
                        {format(new Date(review.submittedAt), 'PPP')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{review.listing?.name}</h4>
                      <p className="text-gray-700">{review.text}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">By {review.authorName}</span>
                      <ApproveToggle
                        reviewId={review.id}
                        approved={review.approved}
                        onToggle={handleApprovalToggle}
                      />
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, reviews.length)} of {reviews.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-secondary btn-sm disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = Math.max(1, currentPage - 2) + i;
              if (pageNum > totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange && onPageChange(pageNum)}
                  className={`btn btn-sm ${
                    pageNum === currentPage ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-secondary btn-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

