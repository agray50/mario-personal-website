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
    
    // Loading text - Enhanced for 2x canvas
    this.loadingText = this.add.text(width / 2, height / 2 - 40, 'MARIO', {
      fontSize: '32px', // Scaled 2x for enhanced canvas
      color: '#0f380f',
      fontFamily: 'monospace'
    }).setOrigin(0.5)
    
    // Progress text - Enhanced for 2x canvas
    this.progressText = this.add.text(width / 2, height / 2 + 20, 'Loading... 0%', {
      fontSize: '16px', // Scaled 2x for enhanced canvas
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
    // Clean up existing atlas if it exists (professional asset replacement pattern)
    if (this.textures.exists('mario-atlas')) {
      console.log('Removing existing mario-atlas texture for professional asset upgrade')
      this.textures.remove('mario-atlas')
    }
    
    // Load professional Mario sprite atlas with blocks (PNG-based)
    // Use the older working multiatlas format - try without trailing slash
    this.load.multiatlas('mario-atlas', '/assets/sprites/mario-atlas.json', '/assets/sprites')
    
    // Also load individual images as backup
    this.load.image('mario-background-backup', '/assets/sprites/mario_1.png')
    this.load.svg('mario-atlas-svg', '/assets/sprites/mario-atlas.svg')
    
    // Blocks are now included in the mario-atlas multiatlas
    
    // Load professional Mario background (bg-1-1.png)
    this.load.image('mario-background', '/assets/backgrounds/bg-1-1.png')
    
    // Enhanced error handling for asset loading
    this.load.on('loaderror', (file: any) => {
      console.error(`Failed to load asset: ${file.key}`, file)
      console.error('File details:', {
        url: file.url,
        type: file.type,
        config: file.config
      })
      if (file.key === 'mario-atlas') {
        console.log('Mario atlas (with blocks) loading failed, check asset paths and format')
        // Try fallback loading
        this.loadFallbackAssets()
      }
      if (file.key === 'mario-background') {
        console.log('Mario background loading failed, using solid color fallback')
      }
    })

    // Enhanced loading success tracking
    this.load.on('filecomplete', (key: string, type: string, data: any) => {
      console.log(`✓ Asset loaded successfully: ${key} (type: ${type})`)
      if (key === 'mario-atlas') {
        console.log('Mario atlas frames available:', Object.keys(data.frames || {}))
      }
    })

    // Audio assets (placeholder - would load actual Mario sounds)
    // this.load.audio('jump', '/assets/audio/jump.mp3')
    // this.load.audio('coin', '/assets/audio/coin.mp3')
    
    console.log('Loading professional Mario assets: multiatlas (mario_1.png + blocks_1.png) + bg-1-1.png')
  }

  private loadFallbackAssets() {
    console.log('Loading fallback assets...')
    // Try loading the older working atlas format
    this.load.multiatlas('mario-atlas', '/assets/sprites/mario-atlas.json', '/assets/sprites')
  }

  private setupLoadingEvents() {
    let transitioned = false
    
    const transitionToMainScene = () => {
      if (transitioned) return
      transitioned = true
      
      console.log('🚀 Starting MainScene...')
      
      try {
        // Check if MainScene is registered
        const mainSceneExists = this.scene.manager.getScene('MainScene')
        console.log('MainScene exists:', !!mainSceneExists)
        
        if (mainSceneExists) {
          this.scene.start('MainScene')
          console.log('✅ MainScene started successfully')
        } else {
          console.error('❌ MainScene not found in scene manager')
          // Try to add and start MainScene manually
          const MainScene = require('./MainScene').default
          this.scene.add('MainScene', MainScene)
          this.scene.start('MainScene')
        }
      } catch (error) {
        console.error('❌ Error starting MainScene:', error)
        // Last resort - just hide the loading screen and show game area
        EventBus.emit(GAME_EVENTS.GAME_READY)
      }
    }
    
    // Update loading progress
    this.load.on('progress', (progress: number) => {
      const percent = Math.round(progress * 100)
      this.progressText.setText(`Loading... ${percent}%`)
      console.log(`📊 Loading progress: ${percent}%`)
      
      // Emit progress event to React
      EventBus.emit(GAME_EVENTS.LOADING_PROGRESS, percent)
      
      // If we reach 100%, force transition after delay
      if (percent === 100) {
        console.log('🎯 Reached 100%, forcing transition in 1 second...')
        this.time.delayedCall(1000, transitionToMainScene)
      }
    })

    // Asset loading complete
    this.load.on('complete', () => {
      console.log('🎮 Load complete event triggered')
      this.progressText.setText('Ready!')
      EventBus.emit(GAME_EVENTS.ASSETS_LOADED)
      
      // Verify assets before transitioning
      const atlasExists = this.textures.exists('mario-atlas')
      const backgroundExists = this.textures.exists('mario-background')
      const backupExists = this.textures.exists('mario-background-backup')
      const svgExists = this.textures.exists('mario-atlas-svg')
      
      console.log('Asset verification:', { 
        atlasExists, 
        backgroundExists, 
        backupExists, 
        svgExists 
      })
      
      if (atlasExists) {
        const atlas = this.textures.get('mario-atlas')
        console.log('Atlas loaded with source images:', atlas.source?.length || 0)
      }
      
      // Transition to main scene after brief delay
      this.time.delayedCall(500, transitionToMainScene)
    })
    
    // Fallback timeout - force transition after 5 seconds regardless
    this.time.delayedCall(5000, () => {
      console.log('⏰ Timeout reached, forcing scene transition...')
      transitionToMainScene()
    })
  }

  create() {
    // Scene is ready
    console.log('🚀 PreloadScene created - starting asset loading...')
    
    // Debug scene state
    console.log('Scene registry keys:', this.scene.manager.keys)
    console.log('Current scene key:', this.scene.key)
    
    // Also emit an event so React can show debugging info
    EventBus.emit(GAME_EVENTS.GAME_STARTED)
  }
}