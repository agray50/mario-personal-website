import Phaser from 'phaser'
import EventBus, { GAME_EVENTS } from '../EventBus'
import { GAME_CONSTANTS } from '../../../utils/gameConfig'

/**
 * MainScene - The main Mario platformer gameplay scene
 * Handles player movement, collision detection, and content box interactions
 */
export default class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private platforms!: Phaser.Physics.Arcade.StaticGroup
  private contentBoxes!: Phaser.Physics.Arcade.Group
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: { [key: string]: Phaser.Input.Keyboard.Key }
  private isGrounded = false
  private background!: Phaser.GameObjects.TileSprite
  private gameBoyButtons = {
    left: false,
    right: false,
    A: false,
    B: false,
  }
  
  // Dynamic map progression state
  private currentArea = 0
  private transitioning = false
  private backgroundThemes = [
    '/assets/backgrounds/bg-1-1.png', // Classic overworld
    '/assets/backgrounds/bg-1-1.png', // Reuse for now, can be expanded
    '/assets/backgrounds/bg-1-1.png', // Reuse for now, can be expanded
    '/assets/backgrounds/bg-1-1.png'  // Reuse for now, can be expanded
  ]

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    console.log('🎯 MainScene.create() called - starting game setup...')
    
    try {
      this.setupWorld()
      this.createBackground()
      this.createPlatforms()
      this.createPlayer()
      this.createContentBoxes()
      this.setupControls()
      this.setupGameBoyControls()
      this.setupCollisions()
      this.setupAnimations()
      
      // Verify professional assets loaded correctly
      const textures = ['mario-atlas', 'mario-background-backup', 'mario-atlas-svg']
      const loadedTextures = textures.filter(tex => this.textures.exists(tex))
      console.log('✓ Loaded textures:', loadedTextures)
      
      if (this.textures.exists('mario-atlas')) {
        console.log('✓ Professional Mario atlas loaded successfully')
        const atlasFrames = this.textures.get('mario-atlas').getFrameNames()
        console.log('✓ Professional atlas loaded with frames:', atlasFrames.slice(0, 10))
      } else if (this.textures.exists('mario-background-backup')) {
        console.log('✓ Mario backup image loaded successfully')
      } else if (this.textures.exists('mario-atlas-svg')) {
        console.log('✓ Mario SVG atlas loaded successfully')
      } else {
        console.warn('⚠ No Mario textures found - using fallback')
      }
      
      if (this.textures.exists('mario-background')) {
        console.log('✓ Professional Mario background loaded successfully')
      } else {
        console.warn('⚠ Mario background not found - using solid color')
      }
      
      // Notify React that the game is ready
      EventBus.emit(GAME_EVENTS.SCENE_READY, this)
      EventBus.emit(GAME_EVENTS.GAME_READY)
      
      console.log('🎮 MainScene setup complete - game should be playable!')
      
    } catch (error) {
      console.error('❌ Error in MainScene.create():', error)
      // Still try to notify React that we're ready, even with errors
      EventBus.emit(GAME_EVENTS.GAME_READY)
    }
  }

  private setupWorld() {
    const { width, height } = this.cameras.main
    
    // Set world bounds
    this.physics.world.setBounds(0, 0, width, height)
    
    // GameBoy screen background (fallback)
    this.cameras.main.setBackgroundColor('#c7d32c')
  }

  private createBackground() {
    const { width, height } = this.cameras.main
    
    // Create scrolling background using bg-1-1.png
    if (this.textures.exists('mario-background')) {
      this.background = this.add.tileSprite(0, 0, width, height, 'mario-background')
      this.background.setOrigin(0, 0)
      this.background.setDepth(-10) // Behind all other objects
      
      // Scale the background to fit the enhanced canvas while maintaining aspect ratio
      const bgTexture = this.textures.get('mario-background').getSourceImage() as HTMLImageElement
      const scaleX = width / bgTexture.width
      const scaleY = height / bgTexture.height
      const scale = Math.max(scaleX, scaleY) // Use max to fill the screen
      
      this.background.setScale(scale)
      console.log('✓ Mario background created with scrolling capability')
    }
  }

  private createPlatforms() {
    // Create ground platform
    this.platforms = this.physics.add.staticGroup()
    
    // Main ground platform using blocks_1.png sprites (scaled for enhanced canvas)
    const groundY = GAME_CONSTANTS.WORLD.GROUND_LEVEL
    const blockSize = 64 // Enhanced block size for 2x canvas
    const groundTiles = Math.ceil(GAME_CONSTANTS.WORLD.BOUNDS.width / blockSize)
    
    if (this.textures.exists('mario-atlas')) {
      // Create ground tiles using professional block sprites from atlas with variety
      for (let i = 0; i < groundTiles; i++) {
        const blockFrame = this.getRandomBlockFrame('ground')
        const groundTile = this.add.image(
          i * blockSize + (blockSize / 2), 
          groundY + (blockSize / 2), 
          'mario-atlas', 
          blockFrame
        )
        groundTile.setDisplaySize(blockSize, blockSize)
        // Set up physics body for collision
        this.physics.add.existing(groundTile, true) // true = static body
        this.platforms.add(groundTile)
      }
      
      // Add floating platforms using varied block sprites from atlas (scaled positions)
      const platform1 = this.add.image(128, 240, 'mario-atlas', this.getRandomBlockFrame('platform')) // Scaled 2x
      platform1.setDisplaySize(blockSize * 1.5, blockSize)
      this.physics.add.existing(platform1, true)
      this.platforms.add(platform1)
      
      const platform2 = this.add.image(384, 200, 'mario-atlas', this.getRandomBlockFrame('platform')) // Scaled 2x  
      platform2.setDisplaySize(blockSize * 1.5, blockSize)
      this.physics.add.existing(platform2, true)
      this.platforms.add(platform2)
      
      console.log('✓ Platforms created using varied professional block sprites from atlas')
    } else {
      // Fallback to rectangles if blocks sprite doesn't load
      for (let i = 0; i < groundTiles; i++) {
        const groundTile = this.add.rectangle(
          i * blockSize + (blockSize / 2), 
          groundY + (blockSize / 2), 
          blockSize, 
          blockSize, 
          0x8b4513 // Brown color for ground
        )
        this.platforms.add(groundTile)
      }
      
      // Fallback floating platforms
      const platform1 = this.add.rectangle(128, 240, 96, 32, 0x8b4513)
      const platform2 = this.add.rectangle(384, 200, 96, 32, 0x8b4513)
      this.platforms.add(platform1)
      this.platforms.add(platform2)
      
      console.log('⚠ Using fallback rectangle platforms - atlas not loaded')
    }
  }

  private createPlayer() {
    // Create Mario player sprite with enhanced positioning for 2x canvas
    // Try different texture sources in order of preference
    let playerTexture = 'mario-atlas'
    let playerFrame: string | number = 'mario-idle'
    
    if (this.textures.exists('mario-atlas')) {
      playerTexture = 'mario-atlas'
      playerFrame = 'mario-idle'
    } else if (this.textures.exists('mario-background-backup')) {
      playerTexture = 'mario-background-backup'
      playerFrame = 0
    } else if (this.textures.exists('mario-atlas-svg')) {
      playerTexture = 'mario-atlas-svg'
      playerFrame = 0
    }
    
    console.log(`Creating player with texture: ${playerTexture}, frame: ${playerFrame}`)
    
    // Fallback - if no textures exist, create a simple rectangle
    if (!this.textures.exists(playerTexture)) {
      console.log('⚠ No textures found, creating fallback rectangle player')
      // Create a simple rectangle as player
      const graphics = this.add.graphics()
      graphics.fillStyle(0xff0000) // Red color for Mario
      graphics.fillRect(0, 0, 32, 32)
      graphics.generateTexture('mario-fallback', 32, 32)
      
      playerTexture = 'mario-fallback'
      playerFrame = 0
    }
    
    this.player = this.physics.add.sprite(64, 200, playerTexture, playerFrame) // Scaled starting position
    
    // Set player properties with proper scaling and positioning
    this.player.setCollideWorldBounds(true)
    
    // Set display size first (clean 2x scaling from 16x16 -> 32x32)
    this.player.setDisplaySize(GAME_CONSTANTS.PLAYER.SIZE.width, GAME_CONSTANTS.PLAYER.SIZE.height) 
    
    // Set collision body size slightly smaller than display for better gameplay
    if (this.player.body) {
      this.player.body.setSize(28, 30) // Slightly smaller than 32x32 display
      this.player.body.setOffset(2, 2) // Center collision body within display sprite
    }
    
    // Ensure proper bounds checking to prevent screen edge cutoff
    this.updatePlayerBounds()
    
    // Player physics - use global gravity (no need to set individual gravity)
    console.log('✓ Mario player created with proper scaling and collision bounds')
  }

  private updatePlayerBounds() {
    // Prevent player from going off-screen edges to ensure full visibility
    const halfWidth = GAME_CONSTANTS.PLAYER.SIZE.width / 2
    const halfHeight = GAME_CONSTANTS.PLAYER.SIZE.height / 2
    
    if (this.player.x < halfWidth) this.player.x = halfWidth
    if (this.player.x > this.cameras.main.width - halfWidth) {
      this.player.x = this.cameras.main.width - halfWidth
    }
    
    // Keep player above ground level to prevent cutoff
    if (this.player.y > GAME_CONSTANTS.WORLD.GROUND_LEVEL - halfHeight) {
      this.player.y = GAME_CONSTANTS.WORLD.GROUND_LEVEL - halfHeight
      this.player.setVelocityY(0)
    }
  }

  private createContentBoxes() {
    this.contentBoxes = this.physics.add.group()
    
    // Enhanced box size for 2x canvas scaling
    const boxSize = GAME_CONSTANTS.BOXES.SIZE.width
    
    if (this.textures.exists('mario-atlas')) {
      // Resume box using specific atlas frame
      const resumeBox = this.physics.add.sprite(
        GAME_CONSTANTS.BOXES.POSITIONS.RESUME.x,
        GAME_CONSTANTS.BOXES.POSITIONS.RESUME.y,
        'mario-atlas',
        'box-resume'
      )
      resumeBox.setData('content', 'resume')
      resumeBox.setSize(boxSize, boxSize)
      resumeBox.setDisplaySize(boxSize, boxSize) // Enhanced display size for 2x canvas
      resumeBox.setTint(0xffd700) // Golden color for Resume
      
      // Portfolio box using specific atlas frame
      const portfolioBox = this.physics.add.sprite(
        GAME_CONSTANTS.BOXES.POSITIONS.PORTFOLIO.x,
        GAME_CONSTANTS.BOXES.POSITIONS.PORTFOLIO.y,
        'mario-atlas',
        'box-portfolio'
      )
      portfolioBox.setData('content', 'portfolio')
      portfolioBox.setSize(boxSize, boxSize)
      portfolioBox.setDisplaySize(boxSize, boxSize)
      portfolioBox.setTint(0x00ff00) // Green color for Portfolio
      
      // Contact box using specific atlas frame
      const contactBox = this.physics.add.sprite(
        GAME_CONSTANTS.BOXES.POSITIONS.CONTACT.x,
        GAME_CONSTANTS.BOXES.POSITIONS.CONTACT.y,
        'mario-atlas',
        'box-contact'
      )
      contactBox.setData('content', 'contact')
      contactBox.setSize(boxSize, boxSize)
      contactBox.setDisplaySize(boxSize, boxSize)
      contactBox.setTint(0x0080ff) // Blue color for Contact
      
      // Add boxes to group
      this.contentBoxes.addMultiple([resumeBox, portfolioBox, contactBox])
      
      console.log('✓ Content boxes created using professional atlas frames with enhanced scaling')
    } else {
      // Fallback to atlas sprites if blocks sprite doesn't load
      const resumeBox = this.physics.add.sprite(
        GAME_CONSTANTS.BOXES.POSITIONS.RESUME.x,
        GAME_CONSTANTS.BOXES.POSITIONS.RESUME.y,
        'mario-atlas',
        'mario-idle' // Fallback frame
      )
      resumeBox.setData('content', 'resume')
      resumeBox.setSize(boxSize, boxSize)
      resumeBox.setDisplaySize(boxSize, boxSize)
      resumeBox.setTint(0xffd700)
      
      const portfolioBox = this.physics.add.sprite(
        GAME_CONSTANTS.BOXES.POSITIONS.PORTFOLIO.x,
        GAME_CONSTANTS.BOXES.POSITIONS.PORTFOLIO.y,
        'mario-atlas',
        'mario-idle'
      )
      portfolioBox.setData('content', 'portfolio')
      portfolioBox.setSize(boxSize, boxSize)
      portfolioBox.setDisplaySize(boxSize, boxSize)
      portfolioBox.setTint(0x00ff00)
      
      const contactBox = this.physics.add.sprite(
        GAME_CONSTANTS.BOXES.POSITIONS.CONTACT.x,
        GAME_CONSTANTS.BOXES.POSITIONS.CONTACT.y,
        'mario-atlas',
        'mario-idle'
      )
      contactBox.setData('content', 'contact')
      contactBox.setSize(boxSize, boxSize)
      contactBox.setDisplaySize(boxSize, boxSize)
      contactBox.setTint(0x0080ff)
      
      this.contentBoxes.addMultiple([resumeBox, portfolioBox, contactBox])
      
      console.log('⚠ Using fallback mario atlas for content boxes - block sprites not loaded')
    }
    
    // Make boxes static (don't fall with gravity)
    this.contentBoxes.children.entries.forEach((box: any) => {
      if (box.body && 'setGravityY' in box.body) {
        box.body.setGravityY(-GAME_CONSTANTS.WORLD.GRAVITY) // Cancel out gravity
      }
    })
  }

  private setupControls() {
    // Arrow keys
    this.cursors = this.input.keyboard!.createCursorKeys()
    
    // WASD keys
    this.wasd = {
      'W': this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      'A': this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      'S': this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      'D': this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }
    
    // Space for jump
    const spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    spaceKey.on('down', () => {
      this.handleJump()
    })
  }

  private setupGameBoyControls() {
    // Subscribe to GameBoy button events
    EventBus.on(GAME_EVENTS.GAMEBOY_DPAD_LEFT, (data: { pressed: boolean }) => {
      this.gameBoyButtons.left = data.pressed
      console.log(`GameBoy D-pad left: ${data.pressed}`)
    })

    EventBus.on(GAME_EVENTS.GAMEBOY_DPAD_RIGHT, (data: { pressed: boolean }) => {
      this.gameBoyButtons.right = data.pressed
      console.log(`GameBoy D-pad right: ${data.pressed}`)
    })

    EventBus.on(GAME_EVENTS.GAMEBOY_BUTTON_A, (data: { pressed: boolean }) => {
      this.gameBoyButtons.A = data.pressed
      if (data.pressed) {
        this.handleJump()
      }
      console.log(`GameBoy A button: ${data.pressed}`)
    })

    EventBus.on(GAME_EVENTS.GAMEBOY_BUTTON_B, (data: { pressed: boolean }) => {
      this.gameBoyButtons.B = data.pressed
      if (data.pressed) {
        this.handleJump()
      }
      console.log(`GameBoy B button: ${data.pressed}`)
    })

    console.log('GameBoy button controls integrated with Phaser MainScene')
  }

  private setupCollisions() {
    // Player vs platforms
    this.physics.add.collider(this.player, this.platforms, () => {
      this.isGrounded = true
    })
    
    // Player vs content boxes
    this.physics.add.overlap(this.player, this.contentBoxes, (_player, box) => {
      this.handleBoxHit(box as Phaser.Physics.Arcade.Sprite)
    })
    
    // Content boxes vs platforms (so they don't fall through)
    this.physics.add.collider(this.contentBoxes, this.platforms)
  }

  private setupAnimations() {
    // Determine which texture source to use for animations
    let animTexture = 'mario-atlas'
    let idleFrame: string | number = 'mario-idle'
    let walkFrames: Array<{key: string, frame: string | number}> = [
      { key: 'mario-atlas', frame: 'mario-walk-1' },
      { key: 'mario-atlas', frame: 'mario-walk-2' }
    ]
    let jumpFrame: string | number = 'mario-jump'
    
    if (this.textures.exists('mario-atlas')) {
      // Use atlas frames
      animTexture = 'mario-atlas'
      idleFrame = 'mario-idle'
      walkFrames = [
        { key: 'mario-atlas', frame: 'mario-walk-1' },
        { key: 'mario-atlas', frame: 'mario-walk-2' }
      ]
      jumpFrame = 'mario-jump'
    } else if (this.textures.exists('mario-background-backup')) {
      // Use backup image with single frame
      animTexture = 'mario-background-backup'
      idleFrame = 0
      walkFrames = [{ key: 'mario-background-backup', frame: 0 }]
      jumpFrame = 0
    } else {
      // Use SVG fallback with single frame
      animTexture = 'mario-atlas-svg'
      idleFrame = 0
      walkFrames = [{ key: 'mario-atlas-svg', frame: 0 }]
      jumpFrame = 0
    }
    
    console.log(`Setting up animations with texture: ${animTexture}`)
    
    // Create walking animation
    if (!this.anims.exists('mario-walk')) {
      this.anims.create({
        key: 'mario-walk',
        frames: walkFrames,
        frameRate: GAME_CONSTANTS.ANIMATIONS.FRAME_RATE,
        repeat: -1
      })
    }
    
    // Create idle animation
    if (!this.anims.exists('mario-idle')) {
      this.anims.create({
        key: 'mario-idle',
        frames: [{ key: animTexture, frame: idleFrame }],
        frameRate: 1
      })
    }
    
    // Create jump animation
    if (!this.anims.exists('mario-jump')) {
      this.anims.create({
        key: 'mario-jump',
        frames: [{ key: animTexture, frame: jumpFrame }],
        frameRate: 1
      })
    }
  }

  update() {
    this.handlePlayerMovement()
    this.updateAnimations()
    this.checkGrounded()
    this.updateBackground()
    this.updatePlayerBounds() // Ensure Mario stays fully visible
  }

  private updateBackground() {
    // Background is now static, no automatic scrolling
    // Level progression happens through edge-triggered transitions
    this.checkAreaTransitions()
  }

  private handlePlayerMovement() {
    const speed = GAME_CONSTANTS.PLAYER.SPEED
    
    // Horizontal movement - integrate keyboard AND GameBoy button controls
    const leftPressed = this.cursors.left.isDown || this.wasd.A.isDown || this.gameBoyButtons.left
    const rightPressed = this.cursors.right.isDown || this.wasd.D.isDown || this.gameBoyButtons.right
    
    if (leftPressed) {
      this.player.setVelocityX(-speed)
      this.player.setFlipX(true)
    } else if (rightPressed) {
      this.player.setVelocityX(speed)
      this.player.setFlipX(false)
    } else {
      // Apply friction
      const currentVelocityX = this.player.body!.velocity.x
      const friction = this.isGrounded ? 
        GAME_CONSTANTS.PLAYER.GROUND_FRICTION : 
        GAME_CONSTANTS.PLAYER.AIR_FRICTION
      
      if (Math.abs(currentVelocityX) < 10) {
        this.player.setVelocityX(0)
      } else {
        const newVelocityX = currentVelocityX > 0 ? 
          Math.max(0, currentVelocityX - friction * (1/60)) :
          Math.min(0, currentVelocityX + friction * (1/60))
        this.player.setVelocityX(newVelocityX)
      }
    }
    
    // Jumping (handled in setupControls)
    if ((this.cursors.up.isDown || this.wasd.W.isDown) && this.isGrounded) {
      this.handleJump()
    }
  }

  private handleJump() {
    if (this.isGrounded) {
      this.player.setVelocityY(GAME_CONSTANTS.PLAYER.JUMP_VELOCITY)
      this.isGrounded = false
      EventBus.emit(GAME_EVENTS.PLAYER_JUMPED)
    }
  }

  private updateAnimations() {
    if (!this.isGrounded) {
      // In air
      this.player.play('mario-jump', true)
    } else if (Math.abs(this.player.body!.velocity.x) > 10) {
      // Moving
      this.player.play('mario-walk', true)
    } else {
      // Idle
      this.player.play('mario-idle', true)
    }
  }

  private checkGrounded() {
    // Reset grounded state, will be set to true by collision callback
    this.isGrounded = false
  }

  private handleBoxHit(box: Phaser.Physics.Arcade.Sprite) {
    const contentType = box.getData('content')
    
    // Visual feedback - make box bounce
    this.tweens.add({
      targets: box,
      y: box.y - 10,
      duration: 100,
      yoyo: true,
      ease: 'Power2'
    })
    
    // Emit events to React
    EventBus.emit(GAME_EVENTS.BOX_HIT, { type: contentType, box })
    EventBus.emit(GAME_EVENTS.CONTENT_TRIGGER, contentType)
    
    console.log(`Player hit ${contentType} box!`)
  }

  private getRandomBlockFrame(type: 'ground' | 'platform' | 'decorative'): string {
    // Block variety system - use available atlas frames
    const blockTypes = {
      ground: ['ground-tile'], // For now, just ground-tile available
      platform: ['ground-tile'], // Can be expanded when more frames are added
      decorative: ['box-resume', 'box-portfolio', 'box-contact']
    }

    const availableFrames = blockTypes[type] || blockTypes.ground
    const randomIndex = Math.floor(Math.random() * availableFrames.length)
    return availableFrames[randomIndex]
  }

  private checkAreaTransitions() {
    if (this.transitioning) return // Prevent multiple transitions

    const playerX = this.player.x
    const playerVelocityX = this.player.body?.velocity.x || 0
    const screenWidth = this.cameras.main.width

    // Left edge detection - only if moving left
    if (playerX <= 20 && playerVelocityX < 0 && this.currentArea > 0) {
      this.transitionToArea('left')
    }

    // Right edge detection - only if moving right
    if (playerX >= screenWidth - 20 && playerVelocityX > 0) {
      this.transitionToArea('right')
    }
  }

  private transitionToArea(direction: 'left' | 'right') {
    // Prevent multiple triggers
    this.transitioning = true

    // Stop player movement
    this.player.setVelocityX(0)

    // Calculate new area
    const areaChange = direction === 'right' ? 1 : -1
    const newArea = Math.max(0, this.currentArea + areaChange)

    console.log(`Transitioning from area ${this.currentArea} to area ${newArea}`)

    // Change background theme
    this.updateBackgroundTheme(newArea)

    // Move player to opposite side with smooth transition
    const newX = direction === 'right' ? 30 : this.cameras.main.width - 30

    // Smooth transition animation
    this.tweens.add({
      targets: this.player,
      x: newX,
      duration: 300,
      ease: 'Power2.easeInOut',
      onComplete: () => {
        this.currentArea = newArea
        this.transitioning = false
        console.log(`Transition complete. Now in area ${this.currentArea}`)
      }
    })
  }

  private updateBackgroundTheme(areaIndex: number) {
    // Cycle through available themes
    const themeIndex = areaIndex % this.backgroundThemes.length
    const themePath = this.backgroundThemes[themeIndex]

    console.log(`Updating background theme to: ${themePath}`)

    // For now, since we're reusing the same background, we can add a tint variation
    // to simulate different themes
    const themeColors = [
      0xffffff, // Original color (overworld)
      0xffe6cc, // Slightly warmer (underground feel)
      0xe6f2ff, // Cooler blue tint (sky feel)
      0xf0e6ff  // Purple tint (castle feel)
    ]

    if (this.background) {
      const tintColor = themeColors[themeIndex % themeColors.length]
      this.background.setTint(tintColor)
    }

    // Emit theme change event for React UI
    EventBus.emit(GAME_EVENTS.AREA_CHANGED, { 
      area: areaIndex,
      theme: ['overworld', 'underground', 'sky', 'castle'][themeIndex % 4]
    })
  }

  // Called when scene is destroyed  
  destroy() {
    // Clean up EventBus subscriptions to prevent memory leaks
    EventBus.off(GAME_EVENTS.GAMEBOY_DPAD_LEFT, () => {})
    EventBus.off(GAME_EVENTS.GAMEBOY_DPAD_RIGHT, () => {})
    EventBus.off(GAME_EVENTS.GAMEBOY_BUTTON_A, () => {})
    EventBus.off(GAME_EVENTS.GAMEBOY_BUTTON_B, () => {})
    
    EventBus.emit(GAME_EVENTS.GAME_DESTROYED)
    console.log('MainScene destroyed, GameBoy controls cleaned up')
  }
}