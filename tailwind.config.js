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
        // Pink & cream — soft pinks, ivory, rose
        cream: '#FDF8F5',
        beige: {
          DEFAULT: '#F0E6E2',
          dark: '#E5D8D2',
        },
        blush: {
          DEFAULT: '#E8C4C4',
          soft: '#F5E8E8',
        },
        sky: {
          DEFAULT: '#F2E8EB',
          soft: '#F8F2F4',
        },
        baby: {
          text: '#4A3C3C',
          'text-soft': '#7A6A6A',
          accent: '#B89595',
          'accent-blush': '#D4B4B4',
          'accent-sky': '#C9B0B8',
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
        // Rose accent
        'hero-accent': '#B87A8A',
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
