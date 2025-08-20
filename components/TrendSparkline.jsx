'use client';

import { useMemo } from 'react';

/**
 * TrendSparkline component displays a small line chart for trends
 * @param {Object} props
 * @param {Array} props.data - Array of data points with { date, count, avgRating }
 * @param {string} props.metric - Metric to display ('count' or 'avgRating')
 * @param {number} props.width - Width of the sparkline
 * @param {number} props.height - Height of the sparkline
 * @param {string} props.color - Color of the line
 * @param {string} props.className - Additional CSS classes
 */
export default function TrendSparkline({ 
  data = [], 
  metric = 'count',
  width = 120, 
  height = 40, 
  color = '#0066CC',
  className = ''
}) {
  const { pathData, minValue, maxValue } = useMemo(() => {
    if (!data || data.length === 0) {
      return { pathData: '', minValue: 0, maxValue: 0 };
    }
    
    // Extract values for the specified metric
    const values = data.map(d => {
      if (metric === 'avgRating' && d.avgRating !== null) {
        return d.avgRating;
      } else if (metric === 'count') {
        return d.count || 0;
      }
      return 0;
    }).filter(v => v !== null && v !== undefined);
    
    if (values.length === 0) {
      return { pathData: '', minValue: 0, maxValue: 0 };
    }
    
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    // If all values are the same, create a flat line
    if (minValue === maxValue) {
      const y = height / 2;
      const pathData = `M 0 ${y} L ${width} ${y}`;
      return { pathData, minValue, maxValue };
    }
    
    // Create path data
    const stepX = width / (values.length - 1);
    const range = maxValue - minValue;
    
    const pathData = values.map((value, index) => {
      const x = index * stepX;
      const y = height - ((value - minValue) / range) * height;
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');
    
    return { pathData, minValue, maxValue };
  }, [data, metric, width, height]);
  
  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-xs text-gray-400">No data</span>
      </div>
    );
  }
  
  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {pathData && (
          <>
            {/* Background area under the line */}
            <defs>
              <linearGradient id={`gradient-${metric}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.05 }} />
              </linearGradient>
            </defs>
            
            {/* Fill area */}
            <path
              d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
              fill={`url(#gradient-${metric})`}
              stroke="none"
            />
            
            {/* Line */}
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {data.length <= 10 && data.map((point, index) => {
              const value = metric === 'avgRating' ? point.avgRating : point.count;
              if (value === null || value === undefined) return null;
              
              const stepX = width / (data.length - 1);
              const x = index * stepX;
              const range = maxValue - minValue;
              const y = range === 0 ? height / 2 : height - ((value - minValue) / range) * height;
              
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2"
                  fill={color}
                  stroke="white"
                  strokeWidth="1"
                />
              );
            })}
          </>
        )}
      </svg>
      
      {/* Tooltip on hover (simplified) */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
          {metric === 'count' ? `${minValue}-${maxValue} reviews` : `${minValue?.toFixed(1)}-${maxValue?.toFixed(1)} stars`}
        </div>
      </div>
    </div>
  );
}
