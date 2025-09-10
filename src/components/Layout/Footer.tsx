import React from 'react'

interface FooterProps {
  className?: string
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`footer ${className}`}>
      <div className="text-center p-4 text-xs text-gameboy-light">
        <p className="mb-2">
          Made with React, TypeScript & Phaser 3
        </p>
        <p className="mb-2">
          Controls: Arrow Keys or WASD to move, Space to jump
        </p>
        <p>
          Keyboard shortcuts: 1=Resume, 2=Portfolio, 3=Contact
        </p>
      </div>
    </footer>
  )
}

export default Footer