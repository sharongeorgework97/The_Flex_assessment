# 🏠 Flex Living Reviews Dashboard

A comprehensive review management system for Flex Living properties, built with Next.js 14 and featuring multi-source review aggregation and approval workflows
## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Setup
```bash
# Clone the repository
git clone <repository-url>
cd flex-living-reviews-dashboard

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables
```bash
# Hostaway API (Required for real data) - successfully connected but
HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
HOSTAWAY_ACCESS_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI2MTE0OCIsImp0aSI6IjZlNGI1YjY4MzVjYjA2NmQ3ZjRkOGEyMTJmYmVjZTJiMWI1NDU4MjY2M2IwMjU4MDRjMTcxNDRkNzQwZDYyYzZhYTM1ODUwMjhlODFmMDE5IiwiaWF0IjoxNzU1NzEwMjU4LjAwOTcxNCwibmJmIjoxNzU1NzEwMjU4LjAwOTcxNiwiZXhwIjoyMDcxMjQzMDU4LjAwOTcxOSwic3ViIjoiIiwic2NvcGVzIjpbImdlbmVyYWwiXSwic2VjcmV0SWQiOjY1MzEwfQ.RiHaMdNM8Kkgh60GW52W0ZIOQXAdaXd3O3IfwVFSVSYdZsRaaWoLGw_1KglJIAydM31Iav3NNL0VTl2HmHSM8AITYDUo2bdjiZ6oe6lg-uaChA8-H-A-aTU56zV4WXwkL3B3W07bUihVq3ahdrCDMz1iXQIzMJHet1C5Kbzi8moFj1e4HKEDMsMQiOkFh9qIrZsqrUouA-RLHo9Lt0OtBO8YgzIo73jWJvl7JH6lyjzINCs1RQ5HicjfR0qK-iKqUqubBebIcK1T5wzVdsuL2loKW2uCYzPN24M92_dLumlUw-wXqEiUba6_36P86vv8tUjJhzuTBhkmq4mN3-eybQ


# Google Places API (Optional - for Google Reviews)
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks and modern patterns
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Icon library
- **date-fns** - Date manipulation utilities

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Node.js** - JavaScript runtime
- **File System** - Local JSON storage for approvals and mock data

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Webpack** - Module bundling (via Next.js)

## 🏗️ Architecture Overview

### Directory Structure
```
flex-living-reviews-dashboard/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Dashboard pages
│   ├── (site)/           # Public-facing pages
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   ├── layout.jsx        # Root layout
│   └── page.jsx          # Homepage
├── components/           # Reusable React components
├── lib/                 # Business logic & utilities
└── data/                # Static data & mock files
```

### Key Design Decisions

#### 1. **Flex Living Brand Integration**
- **Color Scheme**: Green (#2D5A27) and beige (#F5F2E8) theme throughout
- **Typography**: Consistent brand messaging with "the flex." branding
- **Navigation**: Green header with white text and hover effects
- **Cards**: White backgrounds with green borders and beige accents

#### 2. **Multi-Source Review Aggregation**
- **Hostaway API**: Primary source for property reviews
- **Google Places API**: Secondary source for Google reviews
- **Data Normalization**: Unified schema across different sources
- **Fallback Strategy**: Mock data when APIs are unavailable

#### 3. **Location-Based Filtering**
- **City Filtering**: London and Algiers property categories
- **URL Parameters**: Direct links to filtered views (`/properties?city=London`)
- **Empty States**: Contextual messages for cities with no properties
- **Dynamic Navigation**: Homepage links go directly to filtered views

#### 4. **Approval Workflow**
- **Review Management**: Approve/unapprove reviews for public display
- **Local Storage**: JSON file-based approval status persistence
- **Real-time Updates**: Immediate UI updates on approval changes
- **Public Display**: Only approved reviews shown on property pages

## 🔌 API Behaviors

### Hostaway API (`/api/reviews/hostaway`)
```javascript
// Request
GET /api/reviews/hostaway?approved=true&listingId=123&channel=hostaway

// Response
{
  "source": "hostaway",
  "listings": [
    {
      "listingId": "2b-n1-a-29-shoreditch-heights",
      "listingName": "2B N1 A - 29 Shoreditch Heights",
      "reviews": [...],
      "metrics": {
        "count": 3,
        "avgRating5": 5.0,
        "avgRating10": 9.7
      }
    }
  ]
}
```

**Behaviors:**
- Fetches reviews from Hostaway API with provided credentials
- Applies filtering by approval status, listing ID, and channel
- Falls back to mock data if API fails (403 Forbidden, network errors)
- Returns normalized review data with calculated metrics
- Enhanced error logging for debugging API issues

### Google Places API (`/api/reviews/google`)
```javascript
// Request
GET /api/reviews/google?placeId=ChIJ2z8h9nYdgUYRyuLzPOzANiM

// Response
{
  "source": "google",
  "enabled": true,
  "listings": [
    {
      "listingId": "google:ChIJ2z8h9nYdgUYRyuLzPOzANiM",
      "reviews": [...],
      "metrics": {
        "count": 5,
        "avgRating5": 4.2
      }
    }
  ]
}
```

**Behaviors:**
- Requires Google Places API key in environment variables
- Fetches up to 5 reviews per place (API limitation)
- Normalizes Google review format to match application schema
- Falls back to demo data if API key is missing or API fails
- Includes Google-specific metadata (relative time descriptions)

### Listings API (`/api/listings`)
```javascript
// Request
GET /api/listings

// Response
[
  {
    "slug": "2b-n1-a-29-shoreditch-heights",
    "name": "2B N1 A - 29 Shoreditch Heights",
    "address": "29 Shoreditch High Street, London, E1 6LD",
    "city": "London",
    "country": "UK",
    "type": "apartment",
    "bedrooms": 2,
    "googlePlaceId": "ChIJ2z8h9nYdgUYRyuLzPOzANiM"
  }
]
```

**Behaviors:**
- Serves property metadata from local JSON file
- Provides city/country information for location filtering
- Includes Google Place IDs for Google Reviews integration
- Error handling with fallback responses

### Approval API (`/api/reviews/approve`)
```javascript
// Request
POST /api/reviews/approve
{
  "reviewId": "hostaway:11999",
  "approved": true
}

// Response
{
  "success": true,
  "reviewId": "hostaway:11999",
  "approved": true
}
```

**Behaviors:**
- Updates approval status in local JSON file
- Atomic file operations for data integrity
- Returns updated approval status
- Used by dashboard for real-time approval management

## 🔍 Google Reviews Integration Findings

### Implementation Status: ✅ **Fully Implemented**

#### **What Works:**
1. **API Integration**: Successfully fetches reviews from Google Places API
2. **Data Normalization**: Converts Google format to unified application schema
3. **Visual Differentiation**: Google reviews displayed with red/orange avatars and badges
4. **Fallback Strategy**: Graceful degradation when API key is missing
5. **Error Handling**: Comprehensive error handling and logging

#### **API Limitations:**
1. **Review Count**: Google Places API returns maximum 5 reviews per place
2. **Rate Limiting**: Subject to Google's API quotas and rate limits
3. **Authentication**: Requires valid Google Places API key
4. **Data Freshness**: Reviews may not be real-time (depends on Google's indexing)

#### **Technical Implementation:**
```javascript
// Google Places API call
const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`;

// Data normalization
const normalizedReviews = googleReviews.map(review => ({
  id: `google:${review.time}`,
  channel: 'google',
  ratingOverall5: review.rating,
  authorName: review.author_name,
  text: review.text,
  submittedAt: new Date(review.time * 1000).toISOString(),
  googleSpecific: {
    relativeTimeDescription: review.relative_time_description
  }
}));
```

#### **Setup Requirements:**
1. **Google Cloud Console**: Enable Places API
2. **API Key**: Generate and configure API key with appropriate restrictions
3. **Billing**: Enable billing for API usage (Google Places API is not free)
4. **Place IDs**: Configure Google Place IDs for each property in listings.json

#### **Cost Considerations:**
- **Places API**: $17 per 1000 requests
- **Details API**: $17 per 1000 requests
- **Estimated Cost**: ~$0.017 per property per request

## 🎨 Component Architecture

### Core Components
- **`ReviewTable`**: Displays reviews with sorting and filtering
- **`FiltersBar`**: Advanced filtering controls for dashboard
- **`StarRating`**: Reusable star rating component
- **`ChannelBadge`**: Visual indicators for review sources
- **`ApproveToggle`**: Review approval controls
- **`PropertySummaryCards`**: Property overview with metrics
- **`TrendSparkline`**: Performance trend visualization

### Page Components
- **Dashboard**: Review management interface
- **Properties**: Public property listing with location filtering
- **Property Detail**: Individual property page with combined reviews
- **Homepage**: Flex Living branded landing page

## 🚀 Deployment

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Production Considerations
- **Environment Variables**: Configure all API keys
- **Static Assets**: Optimized via Next.js
- **Caching**: Implement appropriate caching strategies
- **Monitoring**: Set up error monitoring and analytics
- **Backup**: Regular backups of approval data

## 📊 Performance Optimizations

1. **Code Splitting**: Automatic via Next.js App Router
2. **Image Optimization**: Next.js Image component
3. **CSS Optimization**: Tailwind purging
4. **API Caching**: Implemented in API routes
5. **Lazy Loading**: Component-level code splitting
6. **Mock Data Fallback**: Ensures functionality without external APIs

## 🔧 Troubleshooting

### Common Issues
1. **403 Forbidden (Hostaway API)**: Check API credentials and permissions
2. **Google Reviews Not Loading**: Verify Google Places API key and billing
3. **Styling Issues**: Restart dev server after Tailwind config changes
4. **Port Conflicts**: Kill existing processes or use different port

### Debug Commands
```bash
# Test Hostaway API
node test-api.js

# Check API endpoints
curl http://localhost:3000/api/reviews/hostaway
curl http://localhost:3000/api/listings

# View logs
npm run dev 2>&1 | grep -i error
```
---
