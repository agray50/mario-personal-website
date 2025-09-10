import Phaser from 'phaser'
import EventBus, { GAME_EVENTS } from '../EventBus'

/**
 * PreloadScene - Handles asset loading for the Mario GameBoy game
 * Shows loading progress and transitions to main game scene
 */
export default class PreloadScene extends Phaser.Scene {
  private loadingText!: Phaser.GameObjects.Text
  private progressText!: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.createLoadingScreen()
    this.loadAssets()
    this.setupLoadingEvents()
  }

  private createLoadingScreen() {
    const { width, height } = this.cameras.main
    
    // GameBoy screen background
    this.cameras.main.setBackgroundColor('#c7d32c')
    
    // Loading text
    this.loadingText = this.add.text(width / 2, height / 2 - 20, 'MARIO', {
      fontSize: '16px',
      color: '#0f380f',
      fontFamily: 'monospace'
    }).setOrigin(0.5)
    
    // Progress text
    this.progressText = this.add.text(width / 2, height / 2 + 10, 'Loading... 0%', {
      fontSize: '8px',
      color: '#0f380f',
      fontFamily: 'monospace'
    }).setOrigin(0.5)
    
    // Simple loading animation - blinking dots
    this.time.addEvent({
      delay: 500,
      callback: () => {
        const currentText = this.loadingText.text
        if (currentText.endsWith('...')) {
          this.loadingText.setText('MARIO')
        } else {
          this.loadingText.setText(currentText + '.')
        }
      },
      loop: true
    })
  }

  private loadAssets() {
    // Mario sprite atlas
    this.load.atlas(
      'mario-atlas', 
      '/assets/sprites/mario-atlas.svg', 
      '/assets/sprites/mario-atlas.json'
    )
    
    // Fallback: Try PNG version if SVG doesn't work
    this.load.on('loaderror', (file: any) => {
      if (file.key === 'mario-atlas' && file.src.includes('.svg')) {
        console.log('SVG atlas failed, trying PNG fallback...')
        // In a real implementation, you'd have a PNG version
      }
    })

    // Background tiles (if needed for level design)
    this.load.image('ground-tile', '/assets/sprites/mario-atlas.svg')
    
    // Audio assets (placeholder - would load actual Mario sounds)
    // this.load.audio('jump', '/assets/audio/jump.mp3')
    // this.load.audio('coin', '/assets/audio/coin.mp3')
  }

  private setupLoadingEvents() {
    // Update loading progress
    this.load.on('progress', (progress: number) => {
      const percent = Math.round(progress * 100)
      this.progressText.setText(`Loading... ${percent}%`)
      
      // Emit progress event to React
      EventBus.emit(GAME_EVENTS.LOADING_PROGRESS, percent)
    })

    // Asset loading complete
    this.load.on('complete', () => {
      this.progressText.setText('Ready!')
      EventBus.emit(GAME_EVENTS.ASSETS_LOADED)
      
      // Transition to main scene after brief delay
      this.time.delayedCall(500, () => {
        this.scene.start('MainScene')
      })
    })
  }

  create() {
    // Scene is ready
    console.log('PreloadScene created')
  }
}