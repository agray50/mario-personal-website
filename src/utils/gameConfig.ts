import Phaser from 'phaser'
import PreloadScene from '../components/Game/scenes/PreloadScene'
import MainScene from '../components/Game/scenes/MainScene'

/**
 * Phaser 3 Game Configuration
 * Optimized for GameBoy screen dimensions and Mario platformer mechanics
 */
const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // WebGL with Canvas fallback
  width: 256, // GameBoy screen width
  height: 192, // GameBoy screen height (adjusted for platformer)
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
  
  // Rendering configuration for pixel art
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true,
  },
  
  // Scale configuration for responsive design
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'phaser-game-container',
    width: 256,
    height: 192,
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

// Game constants for Mario platformer mechanics
export const GAME_CONSTANTS = {
  PLAYER: {
    SPEED: 160,
    JUMP_VELOCITY: -500,
    SIZE: { width: 16, height: 16 },
    GROUND_FRICTION: 800,
    AIR_FRICTION: 300,
  },
  
  WORLD: {
    GRAVITY: 800,
    GROUND_LEVEL: 160,
    BOUNDS: { width: 256, height: 192 },
  },
  
  BOXES: {
    SIZE: { width: 32, height: 32 },
    BOUNCE_FORCE: -100,
    POSITIONS: {
      RESUME: { x: 80, y: 128 },
      PORTFOLIO: { x: 128, y: 128 },
      CONTACT: { x: 176, y: 128 },
    },
  },
  
  ANIMATIONS: {
    FRAME_RATE: 8, // 8 FPS for retro feel
    WALK_FRAMES: ['mario-idle', 'mario-walk-1', 'mario-walk-2'],
    JUMP_FRAME: 'mario-jump',
  },
} as const