import React, { useState } from 'react'

interface Background {
  id: string
  name: string
  url: string
  description: string
}

const backgrounds: Background[] = [
  {
    id: 'world-1',
    name: 'Grass Land',
    url: '/assets/backgrounds/mario-world-1.svg',
    description: 'Classic green hills and blue sky'
  },
  {
    id: 'world-2',
    name: 'Desert Land',
    url: '/assets/backgrounds/mario-world-2.svg',
    description: 'Sandy dunes and golden sun'
  },
  {
    id: 'world-3',
    name: 'Underground',
    url: '/assets/backgrounds/mario-world-3.svg',
    description: 'Dark caves and glowing crystals'
  },
  {
    id: 'world-4',
    name: 'Castle',
    url: '/assets/backgrounds/mario-world-4.svg',
    description: 'Purple sky and fortress towers'
  }
]

interface BackgroundSelectorProps {
  currentBackground: string
  onBackgroundChange: (backgroundId: string) => void
  className?: string
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  currentBackground,
  onBackgroundChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const currentBg = backgrounds.find(bg => bg.id === currentBackground) || backgrounds[0]

  return (
    <div className={`background-selector relative ${className}`}>
      <div className="text-center mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gameboy-buttons hover:bg-gameboy-dark text-gameboy-darkest px-4 py-2 rounded text-xs font-gameboy transition-colors focus:outline-none focus:ring-2 focus:ring-gameboy-light"
          aria-label={`Current background: ${currentBg.name}. Click to change background`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          {currentBg.name} ↓
        </button>
      </div>

      {isOpen && (
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 bg-gameboy-shell border-2 border-gameboy-buttons rounded-lg p-2 z-50 min-w-max"
          role="listbox"
          aria-label="Background options"
        >
          <div className="space-y-2">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => {
                  onBackgroundChange(bg.id)
                  setIsOpen(false)
                }}
                className={`block w-full text-left px-3 py-2 text-xs rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gameboy-light ${
                  bg.id === currentBackground
                    ? 'bg-gameboy-light text-gameboy-darkest'
                    : 'bg-gameboy-buttons text-gameboy-darkest hover:bg-gameboy-dark'
                }`}
                role="option"
                aria-selected={bg.id === currentBackground}
              >
                <div className="font-gameboy mb-1">{bg.name}</div>
                <div className="text-xs opacity-75">{bg.description}</div>
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setIsOpen(false)}
            className="mt-2 w-full bg-gameboy-dark text-gameboy-lightest px-2 py-1 rounded text-xs hover:bg-gameboy-darkest transition-colors focus:outline-none focus:ring-2 focus:ring-gameboy-light"
          >
            Close
          </button>
        </div>
      )}

      {/* Background preview overlay - click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export { backgrounds }
export default BackgroundSelector