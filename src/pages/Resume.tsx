import React from 'react'
import { Link } from 'react-router-dom'

const Resume: React.FC = () => {
  return (
    <div className="min-h-screen bg-gameboy-darkest font-gameboy text-gameboy-lightest p-4">
      <header className="mb-8">
        <Link to="/" className="text-gameboy-light hover:text-gameboy-lightest text-xs mb-4 inline-block">
          ← Back to GameBoy
        </Link>
        <h1 className="text-2xl mb-2">Resume</h1>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        <section>
          <h2 className="text-lg mb-4 text-gameboy-light">About Me</h2>
          <p className="text-xs mb-4">
            Full-stack developer with expertise in React, TypeScript, and game development.
            Passionate about creating unique, interactive web experiences that stand out.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-4 text-gameboy-light">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <h3 className="text-sm mb-2 text-gameboy-lightest">Frontend</h3>
              <ul className="space-y-1">
                <li>React & TypeScript</li>
                <li>Phaser 3 Game Engine</li>
                <li>Tailwind CSS</li>
                <li>Vite & Modern Build Tools</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm mb-2 text-gameboy-lightest">Backend</h3>
              <ul className="space-y-1">
                <li>Node.js & Express</li>
                <li>Database Design</li>
                <li>API Development</li>
                <li>Authentication</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm mb-2 text-gameboy-lightest">Other</h3>
              <ul className="space-y-1">
                <li>Game Development</li>
                <li>Web Accessibility</li>
                <li>Performance Optimization</li>
                <li>Cross-browser Testing</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg mb-4 text-gameboy-light">Experience</h2>
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-sm text-gameboy-lightest">Senior Frontend Developer</h3>
              <p className="text-gameboy-light">Tech Company | 2022 - Present</p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Led development of interactive web applications</li>
                <li>Implemented game-like interfaces for better user engagement</li>
                <li>Optimized performance for mobile and desktop platforms</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm text-gameboy-lightest">Full Stack Developer</h3>
              <p className="text-gameboy-light">Startup Inc. | 2020 - 2022</p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Built full-stack applications from concept to deployment</li>
                <li>Created accessible and SEO-optimized web experiences</li>
                <li>Collaborated with design teams on pixel-perfect implementations</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg mb-4 text-gameboy-light">Education</h2>
          <div className="text-xs">
            <h3 className="text-sm text-gameboy-lightest">Computer Science Degree</h3>
            <p className="text-gameboy-light">University of Technology | 2016 - 2020</p>
            <p>Focus on Web Development and Interactive Media</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Resume