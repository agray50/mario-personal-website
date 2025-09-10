import Phaser from 'phaser'
import PreloadScene from '../components/Game/scenes/PreloadScene'
import MainScene from '../components/Game/scenes/MainScene'

/**
 * Phaser 3 Game Configuration
 * Optimized for GameBoy screen dimensions and Mario platformer mechanics
 */
const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // WebGL with Canvas fallback
  width: 640, // Enhanced canvas width for improved visibility (2x scaling)
  height: 480, // Enhanced canvas height for better gameplay experience (2x scaling)
  parent: 'phaser-game-container', // Container div ID
  backgroundColor: '#c7d32c', // GameBoy screen color
  
  // Physics configuration for Mario platformer
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 800 }, // Mario-style gravity
      debug: false, // Set to true for development debugging
    },
  },
  
  // Scene configuration
  scene: [PreloadScene, MainScene],
  
  // Rendering configuration for pixel art - enhanced for larger scale
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    powerPreference: 'high-performance', // Better performance for larger canvas
  },
  
  // Scale configuration for enhanced responsive design with larger canvas
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'phaser-game-container',
    width: 640,
    height: 480,
    min: {
      width: 320,
      height: 240,
    },
    max: {
      width: 1920,
      height: 1440,
    },
    expandParent: false,
    fullscreenTarget: 'phaser-game-container',
  },
  
  // Input configuration
  input: {
    keyboard: true,
    gamepad: false, // Disable gamepad for now
  },
  
  // Audio configuration
  audio: {
    disableWebAudio: false,
  },
  
  // Banner configuration
  banner: {
    hidePhaser: true, // Hide Phaser banner in console
  },
}

export default gameConfig

// Game constants for Mario platformer mechanics - Enhanced for 2x scaling
export const GAME_CONSTANTS = {
  PLAYER: {
    SPEED: 320, // Scaled 2x for enhanced canvas
    JUMP_VELOCITY: -1000, // Scaled 2x for enhanced canvas
    SIZE: { width: 32, height: 32 }, // Scaled 2x for enhanced canvas
    GROUND_FRICTION: 1600, // Scaled 2x for enhanced canvas
    AIR_FRICTION: 600, // Scaled 2x for enhanced canvas
  },
  
  WORLD: {
    GRAVITY: 1600, // Scaled 2x for enhanced canvas
    GROUND_LEVEL: 400, // Scaled 2x for enhanced 480px height
    BOUNDS: { width: 640, height: 480 }, // Enhanced dimensions for 2x scaling
  },
  
  BOXES: {
    SIZE: { width: 64, height: 64 }, // Scaled 2x for enhanced canvas
    BOUNCE_FORCE: -200, // Scaled 2x for enhanced canvas
    POSITIONS: {
      RESUME: { x: 200, y: 336 }, // Scaled 2x and repositioned for enhanced canvas
      PORTFOLIO: { x: 320, y: 336 }, // Scaled 2x and repositioned for enhanced canvas
      CONTACT: { x: 440, y: 336 }, // Scaled 2x and repositioned for enhanced canvas
    },
  },
  
  ANIMATIONS: {
    FRAME_RATE: 8, // 8 FPS for retro feel - unchanged
    WALK_FRAMES: ['mario-idle', 'mario-walk-1', 'mario-walk-2'],
    JUMP_FRAME: 'mario-jump',
  },
} as const