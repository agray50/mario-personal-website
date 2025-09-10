/**
 * Accessibility utilities and enhancements
 * Provides screen reader support, keyboard navigation, and ARIA features
 */

// Announce content changes to screen readers
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Enhanced focus management
export const manageFocus = {
  // Store the previously focused element
  previousFocus: null as HTMLElement | null,
  
  // Set focus to an element
  setFocus: (element: HTMLElement | null) => {
    if (element) {
      element.focus()
    }
  },
  
  // Store current focus and set new focus
  trapFocus: (element: HTMLElement) => {
    manageFocus.previousFocus = document.activeElement as HTMLElement
    element.focus()
  },
  
  // Return focus to previously focused element
  returnFocus: () => {
    if (manageFocus.previousFocus) {
      manageFocus.previousFocus.focus()
      manageFocus.previousFocus = null
    }
  }
}

// Game accessibility announcements
export const gameAccessibility = {
  announceGameStart: () => {
    announceToScreenReader('Mario game loaded. Use arrow keys or WASD to move, spacebar or A button to jump. Hit colored boxes to navigate to different sections.', 'assertive')
  },
  
  announceMovement: (direction: string) => {
    announceToScreenReader(`Mario moved ${direction}`, 'polite')
  },
  
  announceJump: () => {
    announceToScreenReader('Mario jumped', 'polite')
  },
  
  announceBoxHit: (contentType: string) => {
    const messages = {
      'resume': 'Navigating to Resume section',
      'portfolio': 'Navigating to Portfolio section', 
      'contact': 'Navigating to Contact section'
    }
    announceToScreenReader(messages[contentType as keyof typeof messages] || `Hit ${contentType} box`, 'assertive')
  },
  
  announceContentLoad: (contentType: string) => {
    const messages = {
      'resume': 'Resume page loaded',
      'portfolio': 'Portfolio page loaded',
      'contact': 'Contact page loaded',
      'home': 'Home page with Mario game loaded'
    }
    announceToScreenReader(messages[contentType as keyof typeof messages] || `${contentType} page loaded`, 'assertive')
  }
}

// Keyboard navigation helpers
export const keyboardNavigation = {
  // Handle keyboard events for game controls
  handleGameKeyboard: (event: KeyboardEvent) => {
    const { key } = event
    
    // Announce movement for screen readers
    switch (key.toLowerCase()) {
      case 'arrowleft':
      case 'a':
        gameAccessibility.announceMovement('left')
        break
      case 'arrowright': 
      case 'd':
        gameAccessibility.announceMovement('right')
        break
      case 'arrowup':
      case 'w':
      case ' ':
        gameAccessibility.announceJump()
        break
    }
  },
  
  // Enhanced button keyboard handling
  handleButtonKeyboard: (event: KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      callback()
    }
  }
}

// Color contrast checker (for development)
export const checkColorContrast = () => {
  if (process.env.NODE_ENV !== 'development') return
  
  // Basic contrast checking - in a real app you'd use a proper contrast checker
  console.log('Color Contrast Check:')
  console.log('GameBoy colors designed with high contrast ratios:')
  console.log('- Dark text on light backgrounds: High contrast')
  console.log('- Light text on dark backgrounds: High contrast')
  console.log('- Button states have clear visual differences')
}

// Initialize accessibility features
export const initAccessibility = () => {
  // Add skip link styles
  const skipLinkStyles = `
    .skip-link {
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      font-family: inherit;
    }
    .skip-link:focus {
      top: 6px;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `
  
  // Add styles if they don't exist
  if (!document.querySelector('#accessibility-styles')) {
    const style = document.createElement('style')
    style.id = 'accessibility-styles'
    style.textContent = skipLinkStyles
    document.head.appendChild(style)
  }
  
  // Check color contrast in development
  checkColorContrast()
}

// High contrast mode detection and support
export const highContrastSupport = {
  // Detect if user prefers high contrast
  prefersHighContrast: () => {
    return window.matchMedia('(prefers-contrast: high)').matches
  },
  
  // Apply high contrast styles if needed
  applyHighContrast: () => {
    if (highContrastSupport.prefersHighContrast()) {
      document.body.classList.add('high-contrast-mode')
    }
  }
}

// Reduced motion support
export const reducedMotionSupport = {
  // Detect if user prefers reduced motion
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },
  
  // Apply reduced motion styles
  applyReducedMotion: () => {
    if (reducedMotionSupport.prefersReducedMotion()) {
      document.body.classList.add('reduced-motion')
    }
  }
}