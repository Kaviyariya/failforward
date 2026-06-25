/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0B0F19',
          card: '#161B22',
          border: '#1F2937',
          purple: '#8B5CF6',
          purpleLight: '#A78BFA',
          purpleDark: '#7C3AED',
          text: '#D1D5DB',
          textMuted: '#9CA3AF'
        }
      }
    },
  },
  plugins: [],
}
