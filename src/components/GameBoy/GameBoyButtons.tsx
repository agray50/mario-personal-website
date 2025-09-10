import React, { useState } from 'react'
import { keyboardNavigation } from '../../utils/accessibility'

interface GameBoyButtonsProps {
  onButtonPress?: (button: string) => void
  className?: string
}

const GameBoyButtons: React.FC<GameBoyButtonsProps> = ({ 
  onButtonPress,
  className = '' 
}) => {
  const [pressedButton, setPressedButton] = useState<string | null>(null)

  const handleButtonPress = (button: string) => {
    setPressedButton(button)
    onButtonPress?.(button)
    
    // Haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
    
    // Visual feedback
    setTimeout(() => {
      setPressedButton(null)
    }, 150)
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
          <div className="text-xs font-gameboy text-gameboy-dark mb-2 text-center">D-PAD</div>
          
          {/* D-Pad */}
          <div className="relative w-16 h-16">
            {/* Horizontal bar */}
            <div className="absolute top-1/2 left-0 w-full h-4 bg-gameboy-buttons rounded transform -translate-y-1/2 shadow-inner"></div>
            
            {/* Vertical bar */}
            <div className="absolute left-1/2 top-0 w-4 h-full bg-gameboy-buttons rounded transform -translate-x-1/2 shadow-inner"></div>
            
            {/* Direction buttons */}
            <button
              className={`absolute top-0 left-1/2 w-5 h-7 sm:w-4 sm:h-6 transform -translate-x-1/2 bg-gameboy-buttons hover:bg-gameboy-dark active:bg-gameboy-dark transition-colors focus:outline-none focus:ring-2 focus:ring-gameboy-light rounded-t touch-manipulation ${
                pressedButton === 'up' ? 'bg-gameboy-dark' : ''
              }`}
              onClick={() => handleButtonPress('up')}
              onTouchStart={(e) => handleTouchStart(e, 'up')}
              onKeyDown={(e) => handleKeyDown(e, 'up')}
              aria-label="D-Pad Up"
            />
            
            <button
              className={`absolute bottom-0 left-1/2 w-5 h-7 sm:w-4 sm:h-6 transform -translate-x-1/2 bg-gameboy-buttons hover:bg-gameboy-dark active:bg-gameboy-dark transition-colors focus:outline-none focus:ring-2 focus:ring-gameboy-light rounded-b touch-manipulation ${
                pressedButton === 'down' ? 'bg-gameboy-dark' : ''
              }`}
              onClick={() => handleButtonPress('down')}
              onTouchStart={(e) => handleTouchStart(e, 'down')}
              onKeyDown={(e) => handleKeyDown(e, 'down')}
              aria-label="D-Pad Down"
            />
            
            <button
              className={`absolute left-0 top-1/2 w-7 h-5 sm:w-6 sm:h-4 transform -translate-y-1/2 bg-gameboy-buttons hover:bg-gameboy-dark active:bg-gameboy-dark transition-colors focus:outline-none focus:ring-2 focus:ring-gameboy-light rounded-l touch-manipulation ${
                pressedButton === 'left' ? 'bg-gameboy-dark' : ''
              }`}
              onClick={() => handleButtonPress('left')}
              onTouchStart={(e) => handleTouchStart(e, 'left')}
              onKeyDown={(e) => handleKeyDown(e, 'left')}
              aria-label="D-Pad Left"
            />
            
            <button
              className={`absolute right-0 top-1/2 w-7 h-5 sm:w-6 sm:h-4 transform -translate-y-1/2 bg-gameboy-buttons hover:bg-gameboy-dark active:bg-gameboy-dark transition-colors focus:outline-none focus:ring-2 focus:ring-gameboy-light rounded-r touch-manipulation ${
                pressedButton === 'right' ? 'bg-gameboy-dark' : ''
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
                  className={`w-10 h-10 sm:w-8 sm:h-8 bg-gameboy-buttons hover:bg-gameboy-dark active:bg-gameboy-dark rounded-full shadow-inner transition-colors focus:outline-none focus:ring-2 focus:ring-gameboy-light touch-manipulation ${
                    pressedButton === 'B' ? 'bg-gameboy-dark' : ''
                  }`}
                  onClick={() => handleButtonPress('B')}
                  onTouchStart={(e) => handleTouchStart(e, 'B')}
                  onKeyDown={(e) => handleKeyDown(e, 'B')}
                  aria-label="B Button"
                />
                <div className="text-xs font-gameboy text-gameboy-dark mt-1">B</div>
              </div>
              
              <div className="text-center">
                <button
                  className={`w-10 h-10 sm:w-8 sm:h-8 bg-gameboy-buttons hover:bg-gameboy-dark active:bg-gameboy-dark rounded-full shadow-inner transition-colors focus:outline-none focus:ring-2 focus:ring-gameboy-light touch-manipulation ${
                    pressedButton === 'A' ? 'bg-gameboy-dark' : ''
                  }`}
                  onClick={() => handleButtonPress('A')}
                  onTouchStart={(e) => handleTouchStart(e, 'A')}
                  onKeyDown={(e) => handleKeyDown(e, 'A')}
                  aria-label="A Button"
                />
                <div className="text-xs font-gameboy text-gameboy-dark mt-1">A</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom buttons - Select and Start */}
      <div className="flex justify-center space-x-6 mt-6">
        <div className="text-center">
          <button
            className={`w-14 h-4 sm:w-12 sm:h-3 bg-gameboy-buttons hover:bg-gameboy-dark active:bg-gameboy-dark rounded-full shadow-inner transition-colors focus:outline-none focus:ring-2 focus:ring-gameboy-light touch-manipulation ${
              pressedButton === 'SELECT' ? 'bg-gameboy-dark' : ''
            }`}
            onClick={() => handleButtonPress('SELECT')}
            onTouchStart={(e) => handleTouchStart(e, 'SELECT')}
            onKeyDown={(e) => handleKeyDown(e, 'SELECT')}
            aria-label="Select Button"
          />
          <div className="text-xs font-gameboy text-gameboy-dark mt-1">SELECT</div>
        </div>
        
        <div className="text-center">
          <button
            className={`w-14 h-4 sm:w-12 sm:h-3 bg-gameboy-buttons hover:bg-gameboy-dark active:bg-gameboy-dark rounded-full shadow-inner transition-colors focus:outline-none focus:ring-2 focus:ring-gameboy-light touch-manipulation ${
              pressedButton === 'START' ? 'bg-gameboy-dark' : ''
            }`}
            onClick={() => handleButtonPress('START')}
            onTouchStart={(e) => handleTouchStart(e, 'START')}
            onKeyDown={(e) => handleKeyDown(e, 'START')}
            aria-label="Start Button"
          />
          <div className="text-xs font-gameboy text-gameboy-dark mt-1">START</div>
        </div>
      </div>
    </div>
  )
}

export default GameBoyButtons