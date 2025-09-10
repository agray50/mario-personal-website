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

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.setupWorld()
    this.createPlatforms()
    this.createPlayer()
    this.createContentBoxes()
    this.setupControls()
    this.setupCollisions()
    this.setupAnimations()
    
    // Notify React that the game is ready
    EventBus.emit(GAME_EVENTS.SCENE_READY, this)
    EventBus.emit(GAME_EVENTS.GAME_READY)
    
    console.log('MainScene created and ready')
  }

  private setupWorld() {
    const { width, height } = this.cameras.main
    
    // Set world bounds
    this.physics.world.setBounds(0, 0, width, height)
    
    // GameBoy screen background
    this.cameras.main.setBackgroundColor('#c7d32c')
  }

  private createPlatforms() {
    // Create ground platform
    this.platforms = this.physics.add.staticGroup()
    
    // Main ground platform
    const groundY = GAME_CONSTANTS.WORLD.GROUND_LEVEL
    const groundTiles = Math.ceil(GAME_CONSTANTS.WORLD.BOUNDS.width / 16)
    
    for (let i = 0; i < groundTiles; i++) {
      const groundTile = this.add.rectangle(
        i * 16 + 8, 
        groundY + 8, 
        16, 
        16, 
        0x8b4513 // Brown color for ground
      )
      this.platforms.add(groundTile)
    }
    
    // Add some floating platforms for variety
    const platform1 = this.add.rectangle(64, 120, 48, 16, 0x8b4513)
    const platform2 = this.add.rectangle(192, 100, 48, 16, 0x8b4513)
    this.platforms.add(platform1)
    this.platforms.add(platform2)
  }

  private createPlayer() {
    // Create Mario player sprite
    this.player = this.physics.add.sprite(32, 100, 'mario-atlas', 'mario-idle')
    
    // Set player properties
    this.player.setCollideWorldBounds(true)
    this.player.setSize(GAME_CONSTANTS.PLAYER.SIZE.width, GAME_CONSTANTS.PLAYER.SIZE.height)
    this.player.setDisplaySize(16, 16)
    
    // Player physics - use global gravity (no need to set individual gravity)
  }

  private createContentBoxes() {
    this.contentBoxes = this.physics.add.group()
    
    // Resume box
    const resumeBox = this.physics.add.sprite(
      GAME_CONSTANTS.BOXES.POSITIONS.RESUME.x,
      GAME_CONSTANTS.BOXES.POSITIONS.RESUME.y,
      'mario-atlas',
      'box-resume'
    )
    resumeBox.setData('content', 'resume')
    resumeBox.setSize(GAME_CONSTANTS.BOXES.SIZE.width, GAME_CONSTANTS.BOXES.SIZE.height)
    resumeBox.setDisplaySize(24, 24) // Slightly smaller display size
    resumeBox.setTint(0xffd700) // Golden color
    
    // Portfolio box
    const portfolioBox = this.physics.add.sprite(
      GAME_CONSTANTS.BOXES.POSITIONS.PORTFOLIO.x,
      GAME_CONSTANTS.BOXES.POSITIONS.PORTFOLIO.y,
      'mario-atlas',
      'box-portfolio'
    )
    portfolioBox.setData('content', 'portfolio')
    portfolioBox.setSize(GAME_CONSTANTS.BOXES.SIZE.width, GAME_CONSTANTS.BOXES.SIZE.height)
    portfolioBox.setDisplaySize(24, 24)
    portfolioBox.setTint(0x00ff00) // Green color
    
    // Contact box
    const contactBox = this.physics.add.sprite(
      GAME_CONSTANTS.BOXES.POSITIONS.CONTACT.x,
      GAME_CONSTANTS.BOXES.POSITIONS.CONTACT.y,
      'mario-atlas',
      'box-contact'
    )
    contactBox.setData('content', 'contact')
    contactBox.setSize(GAME_CONSTANTS.BOXES.SIZE.width, GAME_CONSTANTS.BOXES.SIZE.height)
    contactBox.setDisplaySize(24, 24)
    contactBox.setTint(0x0080ff) // Blue color
    
    // Add boxes to group
    this.contentBoxes.addMultiple([resumeBox, portfolioBox, contactBox])
    
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
    // Create walking animation
    if (!this.anims.exists('mario-walk')) {
      this.anims.create({
        key: 'mario-walk',
        frames: [
          { key: 'mario-atlas', frame: 'mario-walk-1' },
          { key: 'mario-atlas', frame: 'mario-walk-2' }
        ],
        frameRate: GAME_CONSTANTS.ANIMATIONS.FRAME_RATE,
        repeat: -1
      })
    }
    
    // Create idle animation
    if (!this.anims.exists('mario-idle')) {
      this.anims.create({
        key: 'mario-idle',
        frames: [{ key: 'mario-atlas', frame: 'mario-idle' }],
        frameRate: 1
      })
    }
    
    // Create jump animation
    if (!this.anims.exists('mario-jump')) {
      this.anims.create({
        key: 'mario-jump',
        frames: [{ key: 'mario-atlas', frame: 'mario-jump' }],
        frameRate: 1
      })
    }
  }

  update() {
    this.handlePlayerMovement()
    this.updateAnimations()
    this.checkGrounded()
  }

  private handlePlayerMovement() {
    const speed = GAME_CONSTANTS.PLAYER.SPEED
    
    // Horizontal movement
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      this.player.setVelocityX(-speed)
      this.player.setFlipX(true)
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
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

  // Called when scene is destroyed  
  destroy() {
    EventBus.emit(GAME_EVENTS.GAME_DESTROYED)
  }
}