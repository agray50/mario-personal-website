/**
 * Performance optimization utilities
 * Handles resource preloading, lazy loading, and performance monitoring
 */

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return

  // Preload critical game assets when user interacts with the page
  const preloadGameAssets = () => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = '/assets/sprites/mario-atlas.svg'
    link.as = 'image'
    document.head.appendChild(link)
  }

  // Preload on user interaction (hover, touch, etc.)
  const events = ['mouseenter', 'touchstart', 'focus']
  const gameArea = document.querySelector('.gameboy-shell')
  
  if (gameArea) {
    events.forEach(event => {
      gameArea.addEventListener(event, preloadGameAssets, { once: true })
    })
  }
}

// Web Vitals monitoring (for development)
export const measureWebVitals = () => {
  if (process.env.NODE_ENV !== 'development') return

  // Measure First Contentful Paint
  new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach((entry) => {
      console.log(`FCP: ${entry.startTime.toFixed(2)}ms`)
    })
  }).observe({ entryTypes: ['paint'] })

  // Measure Largest Contentful Paint
  new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach((entry) => {
      console.log(`LCP: ${entry.startTime.toFixed(2)}ms`)
    })
  }).observe({ entryTypes: ['largest-contentful-paint'] })

  // Measure Cumulative Layout Shift
  new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach((entry: any) => {
      console.log(`CLS: ${entry.value.toFixed(4)}`)
    })
  }).observe({ entryTypes: ['layout-shift'] })
}

// Image lazy loading utility
export const lazyLoadImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src || ''
          img.classList.remove('lazy')
          imageObserver.unobserve(img)
        }
      })
    })

    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img)
    })
  }
}

// Service worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered successfully')
    } catch (error) {
      console.log('Service Worker registration failed:', error)
    }
  }
}

// Memory optimization - cleanup unused resources
export const cleanupResources = () => {
  // Clean up any unused Phaser textures or sounds
  if (typeof window !== 'undefined' && (window as any).phaserGame) {
    // Could implement texture cleanup here if needed
    console.log('Cleaning up game resources...')
  }
}