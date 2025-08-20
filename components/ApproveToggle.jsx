'use client';

import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * ApproveToggle component for approving/unapproving reviews
 * @param {Object} props
 * @param {string} props.reviewId - Review ID
 * @param {boolean} props.approved - Current approval status
 * @param {Function} props.onToggle - Callback when toggle is clicked
 * @param {boolean} props.disabled - Whether the toggle is disabled
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 */
export default function ApproveToggle({ 
  reviewId, 
  approved = false, 
  onToggle, 
  disabled = false,
  size = 'md'
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(approved);
  
  const sizeClasses = {
    sm: 'h-6 w-11',
    md: 'h-6 w-11',
    lg: 'h-7 w-12'
  };
  
  const thumbSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-5 w-5'
  };
  
  const translateClasses = {
    sm: currentStatus ? 'translate-x-5' : 'translate-x-0',
    md: currentStatus ? 'translate-x-5' : 'translate-x-0',
    lg: currentStatus ? 'translate-x-5' : 'translate-x-0'
  };
  
  const handleToggle = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/reviews/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          approved: !currentStatus
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update approval status');
      }
      
      const result = await response.json();
      setCurrentStatus(result.approved);
      
      if (onToggle) {
        onToggle(reviewId, result.approved);
      }
    } catch (error) {
      console.error('Error updating approval status:', error);
      // Optionally show error message to user
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        className={`
          relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
          ${currentStatus ? 'bg-green-600 focus:ring-green-500' : 'bg-gray-200 focus:ring-gray-500'}
          ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          ${sizeClasses[size]}
        `}
        role="switch"
        aria-checked={currentStatus}
        aria-label={`${currentStatus ? 'Approved' : 'Not approved'} - Click to toggle`}
        onClick={handleToggle}
        disabled={disabled || isLoading}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 
            transition duration-200 ease-in-out flex items-center justify-center
            ${translateClasses[size]}
            ${thumbSizeClasses[size]}
          `}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
          ) : currentStatus ? (
            <CheckIcon className="h-3 w-3 text-green-600" />
          ) : (
            <XMarkIcon className="h-3 w-3 text-gray-400" />
          )}
        </span>
      </button>
      <span className={`text-sm font-medium ${currentStatus ? 'text-green-700' : 'text-gray-500'}`}>
        {currentStatus ? 'Approved' : 'Pending'}
      </span>
    </div>
  );
}
