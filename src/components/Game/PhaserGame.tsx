import React, { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import gameConfig from '../../utils/gameConfig'
import EventBus, { GAME_EVENTS } from './EventBus'
import { gameAccessibility, keyboardNavigation } from '../../utils/accessibility'

interface PhaserGameProps {
  currentActiveScene?: (scene: Phaser.Scene) => void
  onContentTrigger?: (contentType: string) => void
  className?: string
}

const PhaserGame: React.FC<PhaserGameProps> = ({ 
  currentActiveScene, 
  onContentTrigger,
  className = '' 
}) => {
  const gameRef = useRef<HTMLDivElement>(null)
  const phaserGameRef = useRef<Phaser.Game | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isGameReady, setIsGameReady] = useState(false)
  const [showMobileInstructions, setShowMobileInstructions] = useState(false)

  // Detect if device is mobile/tablet
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768

  useEffect(() => {
    // Initialize Phaser game
    if (gameRef.current && !phaserGameRef.current) {
      // Create the game instance
      phaserGameRef.current = new Phaser.Game({
        ...gameConfig,
        parent: gameRef.current, // Mount to our div
      })

      // Setup event listeners
      const handleGameReady = () => {
        console.log('🎉 React received GAME_READY event - hiding loading screen...')
        setIsGameReady(true)
        console.log('Phaser game ready!')
        
        // Announce game ready for screen readers
        gameAccessibility.announceGameStart()
        
        // Show mobile instructions on mobile devices
        if (isMobileDevice) {
          setShowMobileInstructions(true)
          setTimeout(() => setShowMobileInstructions(false), 4000)
        }
      }

      const handleSceneReady = (scene: Phaser.Scene) => {
        currentActiveScene?.(scene)
        console.log(`Scene ready: ${scene.scene.key}`)
      }

      const handleContentTrigger = (contentType: string) => {
        onContentTrigger?.(contentType)
        console.log(`Content triggered: ${contentType}`)
        
        // Announce navigation for screen readers
        gameAccessibility.announceBoxHit(contentType)
      }

      const handleLoadingProgress = (progress: number) => {
        console.log(`📊 Loading progress: ${progress}%`)
        setLoadingProgress(progress)
      }

      const handleBoxHit = ({ type }: { type: string; box: any }) => {
        console.log(`Box hit: ${type}`)
        // Could add more visual feedback here
      }

      // Register event listeners
      EventBus.on(GAME_EVENTS.GAME_READY, handleGameReady)
      EventBus.on(GAME_EVENTS.SCENE_READY, handleSceneReady)
      EventBus.on(GAME_EVENTS.CONTENT_TRIGGER, handleContentTrigger)
      EventBus.on(GAME_EVENTS.LOADING_PROGRESS, handleLoadingProgress)
      EventBus.on(GAME_EVENTS.BOX_HIT, handleBoxHit)

      // Cleanup function
      return () => {
        EventBus.off(GAME_EVENTS.GAME_READY, handleGameReady)
        EventBus.off(GAME_EVENTS.SCENE_READY, handleSceneReady)
        EventBus.off(GAME_EVENTS.CONTENT_TRIGGER, handleContentTrigger)
        EventBus.off(GAME_EVENTS.LOADING_PROGRESS, handleLoadingProgress)
        EventBus.off(GAME_EVENTS.BOX_HIT, handleBoxHit)
        
        if (phaserGameRef.current) {
          phaserGameRef.current.destroy(true)
          phaserGameRef.current = null
          setIsGameReady(false)
          setLoadingProgress(0)
        }
      }
    }
  }, [currentActiveScene, onContentTrigger])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true)
        phaserGameRef.current = null
      }
    }
  }, [])

  // Handle GameBoy button presses
  const handleButtonPress = (button: string) => {
    if (!phaserGameRef.current) return

    // Send button events to Phaser
    const currentScene = phaserGameRef.current.scene.getScene('MainScene')
    if (currentScene && currentScene.input && currentScene.input.keyboard) {
      // Simulate keyboard events for GameBoy buttons
      switch (button) {
        case 'A':
          // Simulate spacebar for jump
          currentScene.input.keyboard.emit('keydown-SPACE')
          break
        case 'B':
          // Could be used for special actions
          break
        case 'up':
          currentScene.input.keyboard.emit('keydown-UP')
          break
        case 'down':
          currentScene.input.keyboard.emit('keydown-DOWN')
          break
        case 'left':
          currentScene.input.keyboard.emit('keydown-LEFT')
          break
        case 'right':
          currentScene.input.keyboard.emit('keydown-RIGHT')
          break
        case 'START':
          // Could pause/unpause the game
          break
        case 'SELECT':
          // Could open a menu or switch backgrounds
          break
        default:
          break
      }
    }

    EventBus.emit(GAME_EVENTS.BUTTON_PRESSED, button)
  }

  // Touch controls for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const rect = gameRef.current?.getBoundingClientRect()
    if (!rect || !phaserGameRef.current) return

    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    const width = rect.width
    const height = rect.height

    // Divide screen into zones for touch controls
    const leftZone = width * 0.3
    const rightZone = width * 0.7
    const jumpZone = height * 0.5

    // Left side = move left
    if (x < leftZone) {
      handleButtonPress('left')
    }
    // Right side = move right
    else if (x > rightZone) {
      handleButtonPress('right')
    }
    
    // Upper half = jump
    if (y < jumpZone) {
      handleButtonPress('A') // A button jumps
    }
  }

  // Expose button handler to parent via ref
  useEffect(() => {
    // Store reference to button handler for external access
    if (gameRef.current) {
      (gameRef.current as any).handleButtonPress = handleButtonPress
    }
  }, [])

  return (
    <div className={`phaser-game-wrapper ${className}`}>
      {/* Game container */}
      <div 
        ref={gameRef}
        id="phaser-game-container"
        className="w-full h-full touch-manipulation"
        style={{ 
          imageRendering: 'pixelated',
          touchAction: 'none' // Prevent default touch behaviors
        }}
        onTouchStart={handleTouchStart}
        onKeyDown={(e) => keyboardNavigation.handleGameKeyboard(e.nativeEvent)}
        role="application"
        aria-label="Mario platformer game. Use arrow keys or WASD to move Mario, spacebar to jump. Hit colored boxes to navigate to Resume (gold), Portfolio (green), or Contact (blue) sections."
        tabIndex={0}
      />
      
      {/* Loading overlay */}
      {!isGameReady && (
        <div className="absolute inset-0 bg-gameboy-screen flex flex-col items-center justify-center">
          <div className="text-gameboy-darkest font-gameboy text-center">
            <div className="text-lg mb-2">MARIO</div>
            <div className="text-xs mb-4">Loading... {loadingProgress}%</div>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-gameboy-darkest rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gameboy-darkest rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gameboy-darkest rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile touch instructions */}
      {showMobileInstructions && (
        <div className="absolute inset-0 bg-gameboy-screen bg-opacity-90 flex items-center justify-center z-10">
          <div className="text-gameboy-darkest font-gameboy text-center p-4">
            <div className="text-sm mb-2">Touch Controls</div>
            <div className="text-xs mb-1">Tap left side: ← Move left</div>
            <div className="text-xs mb-1">Tap right side: Move right →</div>
            <div className="text-xs mb-3">Tap upper area: Jump ↑</div>
            <div className="text-xs opacity-75">Or use the GameBoy buttons below</div>
          </div>
        </div>
      )}

      {/* Game ready indicator (for debugging) */}
      {isGameReady && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 text-xs bg-green-500 text-white px-2 py-1 rounded">
          Game Ready
        </div>
      )}
    </div>
  )
}

export default PhaserGame