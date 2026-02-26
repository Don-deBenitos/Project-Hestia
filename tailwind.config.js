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
        // Soft, modern pastel shell – warm neutral base
        cream: '#FFF9F5',
        beige: {
          DEFAULT: '#F4E7DE',
          dark: '#E7D7CC',
        },
        blush: {
          DEFAULT: '#F7DDE5',
          soft: '#FDF3F7',
        },
        sky: {
          DEFAULT: '#F3F4FB',
          soft: '#F9FAFF',
        },
        baby: {
          text: '#3F3436',
          'text-soft': '#7B6B70',
          accent: '#E0B8C2',
          'accent-blush': '#F4C9D2',
          'accent-sky': '#D3C4E4',
        },
        // Dark mode — soft dusk, less contrasty
        'dark-bg': '#17131A',
        'dark-surface': '#221C25',
        'dark-surface-alt': '#29212D',
        'dark-border': '#3A303D',
        'dark-text': '#F6EDF5',
        'dark-text-soft': '#B3A5B3',
        'dark-accent': '#8A6A84',
        'dark-accent-hover': '#9B7A93',
        // Rose accent for pills / icons
        'hero-accent': '#E7B2C0',
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
