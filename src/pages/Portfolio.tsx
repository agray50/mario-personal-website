import React from 'react'
import { Link } from 'react-router-dom'

const Portfolio: React.FC = () => {
  return (
    <div className="min-h-screen bg-gameboy-darkest font-gameboy text-gameboy-lightest p-4">
      <header className="mb-8">
        <Link to="/" className="text-gameboy-light hover:text-gameboy-lightest text-xs mb-4 inline-block">
          ← Back to GameBoy
        </Link>
        <h1 className="text-2xl mb-2">Portfolio</h1>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <section>
          <h2 className="text-lg mb-4 text-gameboy-light">Featured Projects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-gameboy-light p-4 rounded">
              <h3 className="text-sm mb-2 text-gameboy-lightest">Mario GameBoy Website</h3>
              <p className="text-xs mb-3">
                Interactive personal portfolio combining retro gaming aesthetics with modern web technologies.
                Features a playable Mario platformer built with Phaser 3 and React.
              </p>
              <div className="text-xs">
                <p className="mb-2 text-gameboy-light">Technologies:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>React & TypeScript</li>
                  <li>Phaser 3 Game Engine</li>
                  <li>Tailwind CSS</li>
                  <li>Vite Build System</li>
                </ul>
              </div>
            </div>

            <div className="border-2 border-gameboy-light p-4 rounded">
              <h3 className="text-sm mb-2 text-gameboy-lightest">E-Commerce Platform</h3>
              <p className="text-xs mb-3">
                Full-stack e-commerce solution with real-time inventory management,
                payment processing, and admin dashboard.
              </p>
              <div className="text-xs">
                <p className="mb-2 text-gameboy-light">Technologies:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Next.js & TypeScript</li>
                  <li>Node.js & Express</li>
                  <li>PostgreSQL</li>
                  <li>Stripe API</li>
                </ul>
              </div>
            </div>

            <div className="border-2 border-gameboy-light p-4 rounded">
              <h3 className="text-sm mb-2 text-gameboy-lightest">Task Management App</h3>
              <p className="text-xs mb-3">
                Collaborative project management tool with real-time updates,
                team chat, and progress tracking features.
              </p>
              <div className="text-xs">
                <p className="mb-2 text-gameboy-light">Technologies:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>React & Redux</li>
                  <li>Socket.io</li>
                  <li>MongoDB</li>
                  <li>JWT Authentication</li>
                </ul>
              </div>
            </div>

            <div className="border-2 border-gameboy-light p-4 rounded">
              <h3 className="text-sm mb-2 text-gameboy-lightest">Weather Dashboard</h3>
              <p className="text-xs mb-3">
                Interactive weather application with animated visualizations,
                location-based forecasts, and offline capabilities.
              </p>
              <div className="text-xs">
                <p className="mb-2 text-gameboy-light">Technologies:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Vue.js & Vuex</li>
                  <li>D3.js Visualizations</li>
                  <li>Service Workers</li>
                  <li>Weather APIs</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg mb-4 text-gameboy-light">Open Source Contributions</h2>
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-sm text-gameboy-lightest">Phaser 3 Community Plugins</h3>
              <p>Contributed accessibility improvements and mobile touch controls</p>
            </div>
            <div>
              <h3 className="text-sm text-gameboy-lightest">React Component Library</h3>
              <p>Created reusable UI components with built-in accessibility features</p>
            </div>
            <div>
              <h3 className="text-sm text-gameboy-lightest">TypeScript Utilities</h3>
              <p>Developed type-safe utility functions for common web development tasks</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg mb-4 text-gameboy-light">Skills Showcase</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <h3 className="text-sm mb-2 text-gameboy-lightest">Frontend Excellence</h3>
              <p>Creating pixel-perfect, responsive interfaces with attention to accessibility and performance</p>
            </div>
            <div>
              <h3 className="text-sm mb-2 text-gameboy-lightest">Game Development</h3>
              <p>Building interactive experiences that engage users through gamification and creative design</p>
            </div>
            <div>
              <h3 className="text-sm mb-2 text-gameboy-lightest">Full-Stack Integration</h3>
              <p>Seamlessly connecting frontend experiences with robust backend systems and databases</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Portfolio