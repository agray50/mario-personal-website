import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GameBoyShell } from '../components/GameBoy'
import { Header, Footer, BackgroundSelector } from '../components/Layout'
import { preloadCriticalResources, measureWebVitals } from '../utils/performance'
import { initAccessibility, gameAccessibility, highContrastSupport, reducedMotionSupport } from '../utils/accessibility'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [currentBackground, setCurrentBackground] = useState('world-1')

  // Initialize performance optimizations and accessibility
  useEffect(() => {
    preloadCriticalResources()
    measureWebVitals()
    initAccessibility()
    highContrastSupport.applyHighContrast()
    reducedMotionSupport.applyReducedMotion()
    gameAccessibility.announceContentLoad('home')
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

  return (
    <div 
      className="min-h-screen font-gameboy text-gameboy-lightest relative"
      style={{
        backgroundImage: `url(/assets/backgrounds/mario-${currentBackground}.svg)`,
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
        
        {/* Header */}
        <Header />

        {/* Main content */}
        <main id="main-content" className="flex flex-col items-center justify-center p-4">
          <div className="text-center mb-4">
            <h2 className="text-lg mb-4">Welcome to my GameBoy Portfolio</h2>
            <p className="text-xs mb-4">
              Navigate through my resume, portfolio, and contact info by playing the Mario game!
            </p>
            
            {/* Background Selector */}
            <BackgroundSelector
              currentBackground={currentBackground}
              onBackgroundChange={handleBackgroundChange}
              className="mb-6"
            />
          </div>

          {/* GameBoy Component */}
          <GameBoyShell 
            className="mx-auto" 
            onContentTrigger={handleContentTrigger}
          />

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