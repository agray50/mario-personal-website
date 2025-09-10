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
      {/* Screen bezel */}
      <div className="bg-gameboy-darkest p-1 rounded">
        {/* Actual screen area - contains the Phaser game */}
        <div 
          className="w-64 h-48 bg-gameboy-screen rounded relative overflow-hidden"
          style={{ 
            imageRendering: 'pixelated'
          }}
        >
          <Suspense fallback={
            <div className="w-full h-full bg-gameboy-screen flex items-center justify-center">
              <div className="text-gameboy-darkest font-gameboy text-center">
                <div className="text-sm mb-2">MARIO</div>
                <div className="text-xs">Loading game...</div>
                <div className="flex justify-center space-x-1 mt-2">
                  <div className="w-1 h-1 bg-gameboy-darkest rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gameboy-darkest rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-gameboy-darkest rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          }>
            <PhaserGame
              onContentTrigger={onContentTrigger}
              className="w-full h-full"
            />
          </Suspense>

          {/* Screen shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gameboy-dark opacity-10 pointer-events-none rounded"></div>
        </div>
      </div>

      {/* Screen details below */}
      <div className="flex justify-between mt-2 px-2">
        <div className="text-xs font-gameboy text-gameboy-dark">BATTERY</div>
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-gameboy-light rounded-full"></div>
          <div className="text-xs font-gameboy text-gameboy-dark">ON</div>
        </div>
      </div>
    </div>
  )
}

export default GameBoyScreen