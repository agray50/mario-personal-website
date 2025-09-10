import React, { useRef } from 'react'
import GameBoyScreen from './GameBoyScreen'
import GameBoyButtons from './GameBoyButtons'

interface GameBoyShellProps {
  className?: string
  onContentTrigger?: (contentType: string) => void
}

const GameBoyShell: React.FC<GameBoyShellProps> = ({ 
  className = '',
  onContentTrigger 
}) => {
  const screenRef = useRef<HTMLDivElement>(null)
  
  const handleButtonPress = (button: string) => {
    // Find the Phaser game component and send the button press
    const gameContainer = screenRef.current?.querySelector('#phaser-game-container')
    if (gameContainer && (gameContainer as any).handleButtonPress) {
      (gameContainer as any).handleButtonPress(button)
    }
  }
  
  return (
    <div className={`gameboy-shell ${className}`}>
      {/* Main GameBoy body */}
      <div className="relative w-full max-w-sm sm:w-80 bg-gameboy-shell border-4 border-gameboy-buttons rounded-3xl shadow-2xl p-4 sm:p-6 mx-auto">
        {/* Top section with brand text */}
        <div className="text-center mb-4">
          <div className="text-xs font-gameboy text-gameboy-dark mb-1">GAME BOY</div>
          <div className="w-16 h-4 bg-gameboy-buttons rounded-full mx-auto mb-2">
            <div className="w-12 h-2 bg-gameboy-dark rounded-full mx-auto translate-y-1"></div>
          </div>
        </div>

        {/* Screen section */}
        <div ref={screenRef} className="mb-6">
          <div className="bg-gameboy-dark p-4 rounded-lg">
            <GameBoyScreen onContentTrigger={onContentTrigger} />
          </div>
          
          {/* Screen label */}
          <div className="text-center mt-2">
            <div className="text-xs font-gameboy text-gameboy-dark">DOT MATRIX WITH STEREO SOUND</div>
          </div>
        </div>

        {/* Controls section */}
        <GameBoyButtons onButtonPress={handleButtonPress} />

        {/* Bottom section with Nintendo branding */}
        <div className="text-center mt-4">
          <div className="text-xs font-gameboy text-gameboy-dark">Nintendo</div>
        </div>

        {/* Speaker holes */}
        <div className="absolute top-4 right-6">
          <div className="grid grid-cols-6 gap-1">
            {Array.from({ length: 36 }, (_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-gameboy-dark rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameBoyShell