import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Flex Living - Reviews Dashboard',
  description: 'Manage and display property reviews from multiple channels',
};

export default function RootLayout({ children }) {
return (
  <html lang="en">
    <body className={inter.className}>
      <div className="min-h-screen bg-flex-cream">
        <header className="bg-flex-green shadow-lg border-b border-flex-dark-green/20">
          <div className="flex items-center justify-between h-[88px] px-4 sm:px-6 lg:px-8">
            
            {/* Logo */}
            <a className="flex items-center space-x-8" href="/">
              {/* <img
                alt="The Flex"
                fetchpriority="high"
                width={120}
                height={40}
                decoding="async"
                className="object-contain"
                src="/_next/image?url=%2Flogo.png&w=256&q=75"
              /> */}
              <h1 className="text-4xl leading-tight text-white">the flex.</h1>
            </a>

            {/* Navigation Links */}
            <nav className="flex space-x-12">
              <a
                href="/dashboard"
                className="text-white/90 hover:text-white px-4 py-2 rounded-md text-lg font-medium transition-colors hover:bg-white/10"
              >
                Dashboard
              </a>
              <a
                href="/properties"
                className="text-white/90 hover:text-white px-4 py-2 rounded-md text-lg font-medium transition-colors hover:bg-white/10"
              >
                Properties
              </a>
              <a
                href="/"
                className="text-white/90 hover:text-white px-4 py-2 rounded-md text-lg font-medium transition-colors hover:bg-white/10"
              >
                Home
              </a>
            </nav>

          </div>
        </header>

        <main className="bg-flex-cream">{children}</main>
      </div>
    </body>
  </html>
);
}
