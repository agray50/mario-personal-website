import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GameBoyShell } from '../components/GameBoy'
import { Footer, BackgroundSelector } from '../components/Layout'
import { preloadCriticalResources, measureWebVitals } from '../utils/performance'
import { initAccessibility, gameAccessibility, highContrastSupport, reducedMotionSupport } from '../utils/accessibility'
import EventBus, { GAME_EVENTS } from '../components/Game/EventBus'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [currentBackground, setCurrentBackground] = useState('world-1')
  const [gameTheme, setGameTheme] = useState('overworld')

  // Initialize performance optimizations and accessibility
  useEffect(() => {
    preloadCriticalResources()
    measureWebVitals()
    initAccessibility()
    highContrastSupport.applyHighContrast()
    reducedMotionSupport.applyReducedMotion()
    gameAccessibility.announceContentLoad('home')

    // Listen for game area changes to update background theme
    const handleAreaChange = (data: { area: number; theme: string }) => {
      console.log('Area changed:', data)
      setGameTheme(data.theme)
    }

    EventBus.on(GAME_EVENTS.AREA_CHANGED, handleAreaChange)

    // Cleanup event listener on unmount
    return () => {
      EventBus.off(GAME_EVENTS.AREA_CHANGED, handleAreaChange)
    }
  }, [])

  const handleBackgroundChange = (backgroundId: string) => {
    setCurrentBackground(backgroundId)
  }

  const handleContentTrigger = (contentType: string) => {
    console.log(`Content triggered: ${contentType}`)
    
    // Navigate to the appropriate page
    switch (contentType) {
      case 'resume':
        navigate('/resume')
        break
      case 'portfolio':
        navigate('/portfolio')
        break
      case 'contact':
        navigate('/contact')
        break
      default:
        console.log(`Unknown content type: ${contentType}`)
    }
  }

  // Get background style based on game theme
  const getThemeBackground = () => {
    const themes = {
      overworld: 'linear-gradient(to bottom, #87CEEB, #98FB98)', // Sky blue to light green
      underground: 'linear-gradient(to bottom, #2F4F4F, #000000)', // Dark slate gray to black
      sky: 'linear-gradient(to bottom, #87CEFA, #FFFFFF)', // Light sky blue to white
      castle: 'linear-gradient(to bottom, #8B0000, #2F2F2F)' // Dark red to dark gray
    }
    return themes[gameTheme as keyof typeof themes] || themes.overworld
  }

  return (
    <div 
      className="min-h-screen font-gameboy text-gameboy-lightest relative transition-all duration-1000"
      style={{
        background: getThemeBackground(),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gameboy-darkest bg-opacity-75"></div>
      
      {/* Content layer */}
      <div className="relative z-10">
        {/* Skip navigation */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        
        {/* Header removed to provide more space for GameBoy interface */}

        {/* Main content */}
        <main id="main-content" className="flex flex-col items-center justify-center min-h-screen p-4">
          {/* GameBoy Component - Now the primary focus */}
          <GameBoyShell 
            className="mx-auto" 
            onContentTrigger={handleContentTrigger}
          />

          {/* Background Selector - Moved to a less prominent position */}
          <div className="mt-6 opacity-75">
            <BackgroundSelector
              currentBackground={currentBackground}
              onBackgroundChange={handleBackgroundChange}
              className="scale-75"
            />
          </div>

          {/* Direct navigation links for accessibility */}
          <nav className="mt-8" aria-label="Alternative navigation links">
            <div className="text-xs text-gameboy-light mb-2">
              Alternative navigation (if you prefer not to use the game):
            </div>
            <ul className="flex space-x-4 text-xs">
              <li>
                <a 
                  href="/resume" 
                  className="text-gameboy-light hover:text-gameboy-lightest underline focus:outline-none focus:ring-2 focus:ring-gameboy-light rounded px-1"
                  aria-describedby="resume-desc"
                >
                  Resume
                </a>
                <span id="resume-desc" className="sr-only">View my professional resume and work experience</span>
              </li>
              <li>
                <a 
                  href="/portfolio" 
                  className="text-gameboy-light hover:text-gameboy-lightest underline focus:outline-none focus:ring-2 focus:ring-gameboy-light rounded px-1"
                  aria-describedby="portfolio-desc"
                >
                  Portfolio
                </a>
                <span id="portfolio-desc" className="sr-only">Browse my projects and technical work</span>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="text-gameboy-light hover:text-gameboy-lightest underline focus:outline-none focus:ring-2 focus:ring-gameboy-light rounded px-1"
                  aria-describedby="contact-desc"
                >
                  Contact
                </a>
                <span id="contact-desc" className="sr-only">Get in touch with me</span>
              </li>
            </ul>
          </nav>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default Home