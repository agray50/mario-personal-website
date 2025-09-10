/**
 * EventBus for communication between React and Phaser
 * Simple browser-compatible event system
 */
class GameEventBus {
  private static instance: GameEventBus
  private events: { [key: string]: Array<(...args: any[]) => void> } = {}

  private constructor() {}

  public static getInstance(): GameEventBus {
    if (!GameEventBus.instance) {
      GameEventBus.instance = new GameEventBus()
    }
    return GameEventBus.instance
  }

  public on(event: string, callback: (...args: any[]) => void) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  public off(event: string, callback: (...args: any[]) => void) {
    if (!this.events[event]) return
    
    const index = this.events[event].indexOf(callback)
    if (index > -1) {
      this.events[event].splice(index, 1)
    }
  }

  public emit(event: string, ...args: any[]) {
    if (!this.events[event]) return
    
    this.events[event].forEach(callback => {
      try {
        callback(...args)
      } catch (error) {
        console.error(`EventBus error on ${event}:`, error)
      }
    })
  }

  public removeAllListeners(event?: string) {
    if (event) {
      delete this.events[event]
    } else {
      this.events = {}
    }
  }

  // Game lifecycle events
  public static readonly GAME_READY = 'game-ready'
  public static readonly GAME_DESTROYED = 'game-destroyed'
  public static readonly SCENE_READY = 'scene-ready'

  // Player events
  public static readonly PLAYER_MOVED = 'player-moved'
  public static readonly PLAYER_JUMPED = 'player-jumped'

  // Interaction events
  public static readonly BOX_HIT = 'box-hit'
  public static readonly CONTENT_TRIGGER = 'content-trigger'

  // UI events
  public static readonly BUTTON_PRESSED = 'button-pressed'
  public static readonly SHOW_CONTENT = 'show-content'
  public static readonly HIDE_CONTENT = 'hide-content'

  // Asset loading events
  public static readonly ASSETS_LOADING = 'assets-loading'
  public static readonly ASSETS_LOADED = 'assets-loaded'
  public static readonly LOADING_PROGRESS = 'loading-progress'

  // Game state events
  public static readonly GAME_STARTED = 'game-started'
  public static readonly GAME_PAUSED = 'game-paused'
  public static readonly GAME_RESUMED = 'game-resumed'
}

// Export singleton instance
const EventBus = GameEventBus.getInstance()
export default EventBus

// Export event constants for easy importing
export const GAME_EVENTS = {
  GAME_READY: GameEventBus.GAME_READY,
  GAME_DESTROYED: GameEventBus.GAME_DESTROYED,
  SCENE_READY: GameEventBus.SCENE_READY,
  PLAYER_MOVED: GameEventBus.PLAYER_MOVED,
  PLAYER_JUMPED: GameEventBus.PLAYER_JUMPED,
  BOX_HIT: GameEventBus.BOX_HIT,
  CONTENT_TRIGGER: GameEventBus.CONTENT_TRIGGER,
  BUTTON_PRESSED: GameEventBus.BUTTON_PRESSED,
  SHOW_CONTENT: GameEventBus.SHOW_CONTENT,
  HIDE_CONTENT: GameEventBus.HIDE_CONTENT,
  ASSETS_LOADING: GameEventBus.ASSETS_LOADING,
  ASSETS_LOADED: GameEventBus.ASSETS_LOADED,
  LOADING_PROGRESS: GameEventBus.LOADING_PROGRESS,
  GAME_STARTED: GameEventBus.GAME_STARTED,
  GAME_PAUSED: GameEventBus.GAME_PAUSED,
  GAME_RESUMED: GameEventBus.GAME_RESUMED,
} as const