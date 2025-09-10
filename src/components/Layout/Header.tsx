import React from 'react'

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`header ${className}`}>
      <div className="text-center p-4">
        <h1 className="text-2xl font-gameboy text-gameboy-lightest mb-2">
          Mario GameBoy Portfolio
        </h1>
        <p className="text-xs text-gameboy-light">
          Interactive Resume • Portfolio • Contact
        </p>
      </div>
    </header>
  )
}

export default Header