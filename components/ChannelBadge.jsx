'use client';

/**
 * ChannelBadge component displays a colored badge for review channels
 * @param {Object} props
 * @param {string} props.channel - Channel name ('hostaway', 'google', etc.)
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 * @param {string} props.className - Additional CSS classes
 */
export default function ChannelBadge({ channel = '', size = 'md', className = '' }) {
  const channelConfigs = {
    hostaway: {
      label: 'Hostaway',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      icon: '🏠'
    },
    google: {
      label: 'Google',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      icon: '🌟'
    },
    airbnb: {
      label: 'Airbnb',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-800',
      icon: '🏡'
    },
    booking: {
      label: 'Booking.com',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      icon: '🛏️'
    }
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };
  
  const config = channelConfigs[channel.toLowerCase()] || {
    label: channel || 'Unknown',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: '📝'
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClass} ${className}`}
    >
      <span className="mr-1" role="img" aria-label={config.label}>
        {config.icon}
      </span>
      {config.label}
    </span>
  );
}
