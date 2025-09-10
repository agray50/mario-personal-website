/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'gameboy': ['Press Start 2P', 'monospace'],
      },
      colors: {
        gameboy: {
          darkest: '#0f380f',
          dark: '#306230',
          light: '#8bac0f',
          lightest: '#9bbc0f',
          screen: '#c7d32c',
          shell: '#8b956d',
          buttons: '#71816a',
        }
      },
      spacing: {
        'gameboy': '320px',
        'gameboy-screen': '288px',
      },
      screens: {
        'gameboy': '320px',
      }
    },
  },
  plugins: [],
  // Add dark mode support and better accessibility
  darkMode: 'media', // Uses prefers-color-scheme
  // Add custom utilities for accessibility
  corePlugins: {
    // Ensure we have focus-visible support
    ringColor: true,
    ringWidth: true,
    ringOffsetColor: true,
    ringOffsetWidth: true,
  }
}

