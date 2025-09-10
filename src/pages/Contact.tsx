import React from 'react'
import { Link } from 'react-router-dom'

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gameboy-darkest font-gameboy text-gameboy-lightest p-4">
      <header className="mb-8">
        <Link to="/" className="text-gameboy-light hover:text-gameboy-lightest text-xs mb-4 inline-block">
          ← Back to GameBoy
        </Link>
        <h1 className="text-2xl mb-2">Contact</h1>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <section className="text-center">
          <h2 className="text-lg mb-4 text-gameboy-light">Get In Touch</h2>
          <p className="text-xs mb-6">
            Interested in working together? Let's create something amazing!
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-4 text-gameboy-light">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm mb-2 text-gameboy-lightest">Email</h3>
                <a 
                  href="mailto:hello@mariogameboy.dev" 
                  className="text-xs text-gameboy-light hover:text-gameboy-lightest underline"
                >
                  hello@mariogameboy.dev
                </a>
              </div>
              
              <div>
                <h3 className="text-sm mb-2 text-gameboy-lightest">Location</h3>
                <p className="text-xs">San Francisco, CA</p>
                <p className="text-xs">Remote work available</p>
              </div>

              <div>
                <h3 className="text-sm mb-2 text-gameboy-lightest">Availability</h3>
                <p className="text-xs">Open to new opportunities</p>
                <p className="text-xs">Freelance projects welcome</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm mb-2 text-gameboy-lightest">Social Links</h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <a 
                      href="https://github.com/mariogameboy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gameboy-light hover:text-gameboy-lightest underline"
                    >
                      GitHub Profile
                    </a>
                  </div>
                  <div>
                    <a 
                      href="https://linkedin.com/in/mariogameboy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gameboy-light hover:text-gameboy-lightest underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                  <div>
                    <a 
                      href="https://twitter.com/mariogameboy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gameboy-light hover:text-gameboy-lightest underline"
                    >
                      Twitter/X
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm mb-2 text-gameboy-lightest">Response Time</h3>
                <p className="text-xs">Usually within 24 hours</p>
                <p className="text-xs">Faster for urgent projects</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg mb-4 text-gameboy-light">What I Can Help With</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <h3 className="text-sm text-gameboy-lightest">Web Development</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Frontend applications with React/Vue/Angular</li>
                <li>Full-stack development with modern frameworks</li>
                <li>Performance optimization and SEO</li>
                <li>Accessibility compliance (WCAG 2.1)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm text-gameboy-lightest">Game Development</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Browser games with Phaser 3</li>
                <li>Interactive experiences and gamification</li>
                <li>Educational game development</li>
                <li>HTML5 game optimization</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm text-gameboy-lightest">Consulting</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Technical architecture planning</li>
                <li>Code reviews and audits</li>
                <li>Team training and mentoring</li>
                <li>Project management and planning</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm text-gameboy-lightest">Specialties</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Interactive portfolio websites</li>
                <li>Creative user interfaces</li>
                <li>Mobile-first responsive design</li>
                <li>Cross-browser compatibility</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-lg mb-4 text-gameboy-light">Ready to Start?</h2>
          <p className="text-xs mb-4">
            Whether you have a specific project in mind or just want to chat about possibilities,
            I'd love to hear from you!
          </p>
          <a 
            href="mailto:hello@mariogameboy.dev?subject=Project Inquiry"
            className="inline-block bg-gameboy-light text-gameboy-darkest px-6 py-2 text-xs rounded hover:bg-gameboy-lightest transition-colors"
          >
            Send Email
          </a>
        </section>
      </main>
    </div>
  )
}

export default Contact