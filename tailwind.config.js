/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'flex-blue': '#0066CC',
        'flex-gray': '#F8F9FA',
        'flex-green': '#284e4c',
        'flex-dark-green': '#1d3b39',
        'flex-beige': '#F5F2E8',
        'flex-cream': '#FFF9E9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
