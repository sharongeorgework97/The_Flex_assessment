'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

/**
 * StarRating component displays a 5-star rating
 * @param {Object} props
 * @param {number} props.rating - Rating value (0-5, supports decimals)
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 * @param {boolean} props.showValue - Whether to show the numeric value
 * @param {string} props.className - Additional CSS classes
 */
export default function StarRating({ 
  rating = 0, 
  size = 'md', 
  showValue = false, 
  className = '' 
}) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const iconSize = sizeClasses[size] || sizeClasses.md;
  const textSize = textSizeClasses[size] || textSizeClasses.md;
  
  // Ensure rating is between 0 and 5
  const clampedRating = Math.max(0, Math.min(5, rating || 0));
  
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    const isFilled = i <= clampedRating;
    const isHalfFilled = i - 0.5 === clampedRating;
    
    stars.push(
      <div key={i} className="relative">
        {isFilled || isHalfFilled ? (
          <StarIcon className={`${iconSize} text-yellow-400`} />
        ) : (
          <StarOutlineIcon className={`${iconSize} text-gray-300`} />
        )}
        {isHalfFilled && (
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <StarIcon className={`${iconSize} text-yellow-400`} />
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex space-x-0.5">
        {stars}
      </div>
      {showValue && (
        <span className={`ml-1 font-medium text-gray-700 ${textSize}`}>
          {clampedRating > 0 ? clampedRating.toFixed(1) : 'No rating'}
        </span>
      )}
    </div>
  );
}
