import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-flex-green mb-4">
          Furnished apartments in top locations
        </h1>
        <p className="text-xl text-flex-dark-green mb-8 max-w-3xl mx-auto">
          The Flex apartments are designed with you in mind – all you have to do is unpack your bags and start living. 
          With flexible terms and seamless service, we offer move-in ready apartments across top cities around the globe. 
          Stay for days, weeks or months, and leave when it suits you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        {/* LONDON Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div className="h-48 bg-gradient-to-br from-flex-green to-flex-dark-green flex items-center justify-center">
            <div className="text-center text-white">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-2xl font-bold">LONDON</h3>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-flex-green mb-2">London Properties</h3>
            <p className="text-flex-dark-green mb-4">
              Experience the best of London with our premium furnished apartments in prime locations.
            </p>
            <Link
              href="/properties?city=London"
              className="inline-flex items-center text-flex-green hover:text-flex-dark-green font-medium transition-colors"
            >
              Explore London Properties
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ALGIERS Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div className="h-48 bg-gradient-to-br from-flex-dark-green to-green-600 flex items-center justify-center">
            <div className="text-center text-white">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-2xl font-bold">ALGIERS</h3>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-flex-green mb-2">Algiers Properties</h3>
            <p className="text-flex-dark-green mb-4">
              Discover beautiful furnished apartments in the heart of Algiers with stunning views.
            </p>
            <Link
              href="/properties?city=Algiers"
              className="inline-flex items-center text-flex-green hover:text-flex-dark-green font-medium transition-colors"
            >
              Explore Algiers Properties
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Management Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
        <h2 className="text-2xl font-bold text-flex-green text-center mb-8">
          Property Management
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-flex-beige rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-flex-dark-green/20">
              <svg className="w-8 h-8 text-flex-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-flex-green mb-2">Reviews Dashboard</h3>
            <p className="text-flex-dark-green mb-4">
              Manage all property reviews, approve content for public display, and analyze performance trends.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-flex-green text-white rounded-lg hover:bg-flex-dark-green transition-colors font-medium"
            >
              Open Dashboard
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-flex-beige rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-flex-dark-green/20">
              <svg className="w-8 h-8 text-flex-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-flex-green mb-2">Property Reviews</h3>
            <p className="text-flex-dark-green mb-4">
              View how reviews appear on property pages. Only approved reviews are displayed to maintain quality.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center px-6 py-3 bg-white text-flex-green border-2 border-flex-green rounded-lg hover:bg-flex-beige transition-colors font-medium"
            >
              View Properties
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-flex-beige rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-flex-green text-center mb-8">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-6 h-6 text-flex-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-flex-green mb-2">Multi-Channel Integration</h3>
            <p className="text-sm text-flex-dark-green">
              Aggregate reviews from Hostaway, Google, and other platforms in a unified dashboard.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-6 h-6 text-flex-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-flex-green mb-2">Approval Workflow</h3>
            <p className="text-sm text-flex-dark-green">
              Review and approve content before it appears on property pages to maintain quality.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-6 h-6 text-flex-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="font-semibold text-flex-green mb-2">Analytics & Insights</h3>
            <p className="text-sm text-flex-dark-green">
              Track performance trends, rating distributions, and category breakdowns across properties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
