import React, { Suspense } from 'react'

// Lazy load the PhaserGame component to reduce initial bundle size
const PhaserGame = React.lazy(() => 
  import('../Game/PhaserGame').then(module => ({ default: module.default }))
)

interface GameBoyScreenProps {
  className?: string
  onContentTrigger?: (contentType: string) => void
}

const GameBoyScreen: React.FC<GameBoyScreenProps> = ({ 
  className = '',
  onContentTrigger 
}) => {
  return (
    <div className={`gameboy-screen ${className}`}>
      {/* Screen bezel - Enhanced for larger display */}
      <div className="bg-gameboy-darkest p-2 rounded-lg shadow-inner">
        {/* Actual screen area - Enhanced responsive sizing */}
        <div 
          className="gameboy-screen-enhanced bg-gameboy-screen rounded-md relative overflow-hidden"
          style={{ 
            width: 'var(--gameboy-screen-width)',
            height: 'var(--gameboy-screen-height)',
            imageRendering: 'pixelated'
          }}
        >
          <Suspense fallback={
            <div className="w-full h-full bg-gameboy-screen flex items-center justify-center">
              <div className="text-gameboy-darkest font-gameboy text-center">
                <div className="text-lg mb-3">MARIO</div>
                <div className="text-sm">Loading game...</div>
                <div className="flex justify-center space-x-2 mt-3">
                  <div className="w-2 h-2 bg-gameboy-darkest rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gameboy-darkest rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gameboy-darkest rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          }>
            <PhaserGame
              onContentTrigger={onContentTrigger}
              className="w-full h-full"
            />
          </Suspense>

          {/* Screen shine effect - Enhanced for larger display */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-gameboy-dark opacity-15 pointer-events-none rounded-md"></div>
        </div>
      </div>

      {/* Screen details below - Enhanced for proportional scaling */}
      <div className="flex justify-between mt-3 px-3">
        <div className="text-sm font-gameboy text-gameboy-dark">BATTERY</div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gameboy-light rounded-full"></div>
          <div className="text-sm font-gameboy text-gameboy-dark">ON</div>
        </div>
      </div>
    </div>
  )
}

export default GameBoyScreen