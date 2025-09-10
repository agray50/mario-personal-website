import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Optimizations for Phaser 3
  define: {
    CANVAS_RENDERER: true,
    WEBGL_RENDERER: true,
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Phaser library gets its own chunk
          if (id.includes('node_modules/phaser')) {
            return 'phaser'
          }
          // React Router gets its own chunk
          if (id.includes('node_modules/react-router-dom')) {
            return 'router'
          }
          // Font libraries
          if (id.includes('node_modules/@fontsource')) {
            return 'fonts'
          }
          // Game components get their own chunk
          if (id.includes('src/components/Game')) {
            return 'game'
          }
          // GameBoy components 
          if (id.includes('src/components/GameBoy')) {
            return 'gameboy'
          }
          // React core
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
          // Other vendor dependencies
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
    // Asset optimization
    assetsInlineLimit: 2048, // Smaller inline limit for better caching
    sourcemap: true,
    // Performance optimizations
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },
  // Asset handling for game sprites and audio
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.webp', '**/*.mp3', '**/*.wav', '**/*.json'],
})