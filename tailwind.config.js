/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Lighter pink theme — soft pastels, ivory, rose
        cream: '#FEF9F7',
        beige: {
          DEFAULT: '#F5EDEA',
          dark: '#EDE2DE',
        },
        blush: {
          DEFAULT: '#F0D6D6',
          soft: '#FAF2F2',
        },
        sky: {
          DEFAULT: '#F6EEF0',
          soft: '#FCF8F9',
        },
        baby: {
          text: '#4A3C3C',
          'text-soft': '#7A6A6A',
          accent: '#C9A8A8',
          'accent-blush': '#E0C8C8',
          'accent-sky': '#D4BEC4',
        },
        // Dark mode — warm dusk
        'dark-bg': '#1A1518',
        'dark-surface': '#261F23',
        'dark-surface-alt': '#2E2629',
        'dark-border': '#3D3338',
        'dark-text': '#F5EDF0',
        'dark-text-soft': '#A89A9E',
        'dark-accent': '#6B5558',
        'dark-accent-hover': '#7D6568',
        // Rose accent (lighter)
        'hero-accent': '#D4A0A8',
      },
      fontFamily: {
        display: ['Cormorant Infant', 'Georgia', 'serif'],
        body: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(74, 60, 60, 0.08)',
        'soft-dark': '0 4px 20px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
