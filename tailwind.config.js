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
        // Enhanced responsive GameBoy dimensions
        'gameboy-enhanced': 'clamp(400px, 75vw, 1200px)',
        'gameboy-screen-enhanced': 'clamp(320px, 60vw, 800px)',
        'gameboy-text': 'clamp(0.75rem, 1.2vw, 1.5rem)',
        'gameboy-element': 'clamp(1rem, 2vw, 2.5rem)',
      },
      screens: {
        'gameboy': '320px',
        'gameboy-sm': '480px',
        'gameboy-md': '768px', 
        'gameboy-lg': '1024px',
        'gameboy-xl': '1200px',
      },
      // Add container query support
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      // Enhanced aspect ratios for GameBoy
      aspectRatio: {
        'gameboy': '10/16',
        'gameboy-screen': '4/3',
      }
    },
  },
  plugins: [
    // Add container queries support
    function({ addUtilities }) {
      addUtilities({
        '.container-type-inline-size': {
          'container-type': 'inline-size',
        },
        '.container-type-size': {
          'container-type': 'size',
        },
        '.container-type-normal': {
          'container-type': 'normal',
        },
      })
    }
  ],
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

