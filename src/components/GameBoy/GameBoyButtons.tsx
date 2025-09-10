import React, { useState, useRef } from 'react'
import { keyboardNavigation } from '../../utils/accessibility'
import EventBus, { GAME_EVENTS } from '../Game/EventBus'

interface GameBoyButtonsProps {
  onButtonPress?: (button: string) => void
  className?: string
}

const GameBoyButtons: React.FC<GameBoyButtonsProps> = ({ 
  onButtonPress,
  className = '' 
}) => {
  const [pressedButton, setPressedButton] = useState<string | null>(null)
  const buttonStates = useRef<{ [key: string]: boolean }>({})

  const handleButtonPress = (button: string) => {
    setPressedButton(button)
    onButtonPress?.(button)
    
    // Track button state for continuous movement
    buttonStates.current[button] = true
    
    // Emit GameBoy control events to Phaser game
    switch (button) {
      case 'left':
        EventBus.emit(GAME_EVENTS.GAMEBOY_DPAD_LEFT, { pressed: true })
        EventBus.emit(GAME_EVENTS.GAMEBOY_BUTTON_PRESS, { button: 'left', pressed: true })
        break
      case 'right':
        EventBus.emit(GAME_EVENTS.GAMEBOY_DPAD_RIGHT, { pressed: true })
        EventBus.emit(GAME_EVENTS.GAMEBOY_BUTTON_PRESS, { button: 'right', pressed: true })
        break
      case 'A':
        EventBus.emit(GAME_EVENTS.GAMEBOY_BUTTON_A, { pressed: true })
        EventBus.emit(GAME_EVENTS.GAMEBOY_BUTTON_PRESS, { button: 'A', pressed: true })
        break
      case 'B':
        EventBus.emit(GAME_EVENTS.GAMEBOY_BUTTON_B, { pressed: true })
        EventBus.emit(GAME_EVENTS.GAMEBOY_BUTTON_PRESS, { button: 'B', pressed: true })
        break
      default:
        EventBus.emit(GAME_EVENTS.GAMEBOY_BUTTON_PRESS, { button, pressed: true })
    }
    
    // Haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
    
    // Visual feedback
    setTimeout(() => {
      setPressedButton(null)
      
      // Emit button release events
      buttonStates.current[button] = false
      switch (button) {
        case 'left':
          EventBus.emit(GAME_EVENTS.GAMEBOY_DPAD_LEFT, { pressed: false })
          EventBus.emit(GAME_EVENTS.GAMEBOY_BUTTON_RELEASE, { button: 'left', pressed: false })
          break
        case 'right':
          EventBus.emit(GAME_EVENTS.GAMEBOY_DPAD_RIGHT, { pressed: false })
          EventBus.emit(GAME_EVENTS.GAMEBOY_BUTTON_RELEASE, { button: 'right', pressed: false })
          break
        case 'A':
          EventBus.emit(GAME_EVENTS.GAMEBOY_BUTTON_A, { pressed: false })
          EventBus.emit(GAME_EVENTS.GAMEBOY_BUTTON_RELEASE, { button: 'A', pressed: false })
          break
        case 'B':
          EventBus.emit(GAME_EVENTS.GAMEBOY_BUTTON_B, { pressed: false })
          EventBus.emit(GAME_EVENTS.GAMEBOY_BUTTON_RELEASE, { button: 'B', pressed: false })
          break
        default:
          EventBus.emit(GAME_EVENTS.GAMEBOY_BUTTON_RELEASE, { button, pressed: false })
      }
    }, 150)
    
    console.log(`GameBoy button pressed: ${button}`)
  }

  const handleTouchStart = (e: React.TouchEvent, button: string) => {
    e.preventDefault() // Prevent scrolling and other touch behaviors
    handleButtonPress(button)
  }

  const handleKeyDown = (event: React.KeyboardEvent, button: string) => {
    keyboardNavigation.handleButtonKeyboard(event.nativeEvent, () => {
      handleButtonPress(button)
    })
  }

  return (
    <div className={`gameboy-buttons ${className}`}>
      {/* D-Pad and Action Buttons Container */}
      <div className="flex justify-between items-center">
        {/* Left side - D-Pad */}
        <div className="relative">
          <div className="gameboy-proportional-text font-gameboy text-gameboy-dark mb-2 text-center">D-PAD</div>
          
          {/* D-Pad */}
          <div className="relative gameboy-dpad">
            {/* Horizontal bar */}
            <div className="absolute top-1/2 left-0 w-full gameboy-dpad-bar-h bg-gameboy-buttons rounded transform -translate-y-1/2 shadow-inner"></div>
            
            {/* Vertical bar */}
            <div className="absolute left-1/2 top-0 gameboy-dpad-bar-v h-full bg-gameboy-buttons rounded transform -translate-x-1/2 shadow-inner"></div>
            
            {/* Direction buttons */}
            <button
              className={`absolute top-0 left-1/2 gameboy-dpad-button-v transform -translate-x-1/2 bg-gameboy-buttons hover:bg-gameboy-dark active:bg-gameboy-dark transition-all duration-75 focus:outline-none focus:ring-2 focus:ring-gameboy-light rounded-t touch-manipulation ${
                pressedButton === 'up' ? 'bg-gameboy-dark scale-95 shadow-inner' : ''
              }`}
              onClick={() => handleButtonPress('up')}
              onTouchStart={(e) => handleTouchStart(e, 'up')}
              onKeyDown={(e) => handleKeyDown(e, 'up')}
              aria-label="D-Pad Up"
            />
            
            <button
              className={`absolute bottom-0 left-1/2 gameboy-dpad-button-v transform -translate-x-1/2 bg-gameboy-buttons hover:bg-gameboy-dark active:bg-gameboy-dark transition-all duration-75 focus:outline-none focus:ring-2 focus:ring-gameboy-light rounded-b touch-manipulation ${
                pressedButton === 'down' ? 'bg-gameboy-dark scale-95 shadow-inner' : ''
              }`}
              onClick={() => handleButtonPress('down')}
              onTouchStart={(e) => handleTouchStart(e, 'down')}
              onKeyDown={(e) => handleKeyDown(e, 'down')}
              aria-label="D-Pad Down"
            />
            
            <button
              className={`absolute left-0 top-1/2 gameboy-dpad-button-h transform -translate-y-1/2 bg-gameboy-buttons hover:bg-gameboy-dark active:bg-gameboy-dark transition-all duration-75 focus:outline-none focus:ring-2 focus:ring-gameboy-light rounded-l touch-manipulation ${
                pressedButton === 'left' ? 'bg-gameboy-dark scale-95 shadow-inner' : ''
              }`}
              onClick={() => handleButtonPress('left')}
              onTouchStart={(e) => handleTouchStart(e, 'left')}
              onKeyDown={(e) => handleKeyDown(e, 'left')}
              aria-label="D-Pad Left"
            />
            
            <button
              className={`absolute right-0 top-1/2 gameboy-dpad-button-h transform -translate-y-1/2 bg-gameboy-buttons hover:bg-gameboy-dark active:bg-gameboy-dark transition-all duration-75 focus:outline-none focus:ring-2 focus:ring-gameboy-light rounded-r touch-manipulation ${
                pressedButton === 'right' ? 'bg-gameboy-dark scale-95 shadow-inner' : ''
              }`}
              onClick={() => handleButtonPress('right')}
              onTouchStart={(e) => handleTouchStart(e, 'right')}
              onKeyDown={(e) => handleKeyDown(e, 'right')}
              aria-label="D-Pad Right"
            />
          </div>
        </div>

        {/* Right side - Action Buttons */}
        <div>
          <div className="flex flex-col space-y-2">
            {/* B and A buttons */}
            <div className="flex space-x-3 justify-end">
              <div className="text-center">
                <button
                  className={`gameboy-action-button bg-gameboy-buttons hover:bg-gameboy-dark active:bg-gameboy-dark rounded-full shadow-inner transition-all duration-75 focus:outline-none focus:ring-2 focus:ring-gameboy-light touch-manipulation ${
                    pressedButton === 'B' ? 'bg-gameboy-dark scale-95 shadow-inner' : ''
                  }`}
                  onClick={() => handleButtonPress('B')}
                  onTouchStart={(e) => handleTouchStart(e, 'B')}
                  onKeyDown={(e) => handleKeyDown(e, 'B')}
                  aria-label="B Button"
                />
                <div className="gameboy-proportional-text font-gameboy text-gameboy-dark mt-1">B</div>
              </div>
              
              <div className="text-center">
                <button
                  className={`gameboy-action-button bg-gameboy-buttons hover:bg-gameboy-dark active:bg-gameboy-dark rounded-full shadow-inner transition-all duration-75 focus:outline-none focus:ring-2 focus:ring-gameboy-light touch-manipulation ${
                    pressedButton === 'A' ? 'bg-gameboy-dark scale-95 shadow-inner' : ''
                  }`}
                  onClick={() => handleButtonPress('A')}
                  onTouchStart={(e) => handleTouchStart(e, 'A')}
                  onKeyDown={(e) => handleKeyDown(e, 'A')}
                  aria-label="A Button"
                />
                <div className="gameboy-proportional-text font-gameboy text-gameboy-dark mt-1">A</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom buttons - Select and Start */}
      <div className="flex justify-center space-x-6 mt-6">
        <div className="text-center">
          <button
            className={`gameboy-select-start-button bg-gameboy-buttons hover:bg-gameboy-dark active:bg-gameboy-dark rounded-full shadow-inner transition-all duration-75 focus:outline-none focus:ring-2 focus:ring-gameboy-light touch-manipulation ${
              pressedButton === 'SELECT' ? 'bg-gameboy-dark scale-95 shadow-inner' : ''
            }`}
            onClick={() => handleButtonPress('SELECT')}
            onTouchStart={(e) => handleTouchStart(e, 'SELECT')}
            onKeyDown={(e) => handleKeyDown(e, 'SELECT')}
            aria-label="Select Button"
          />
          <div className="gameboy-proportional-text font-gameboy text-gameboy-dark mt-1">SELECT</div>
        </div>
        
        <div className="text-center">
          <button
            className={`gameboy-select-start-button bg-gameboy-buttons hover:bg-gameboy-dark active:bg-gameboy-dark rounded-full shadow-inner transition-all duration-75 focus:outline-none focus:ring-2 focus:ring-gameboy-light touch-manipulation ${
              pressedButton === 'START' ? 'bg-gameboy-dark scale-95 shadow-inner' : ''
            }`}
            onClick={() => handleButtonPress('START')}
            onTouchStart={(e) => handleTouchStart(e, 'START')}
            onKeyDown={(e) => handleKeyDown(e, 'START')}
            aria-label="Start Button"
          />
          <div className="gameboy-proportional-text font-gameboy text-gameboy-dark mt-1">START</div>
        </div>
      </div>
    </div>
  )
}

export default GameBoyButtons