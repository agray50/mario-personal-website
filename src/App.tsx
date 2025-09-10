import { FC, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Lazy load all page components for better performance
const Home = lazy(() => import('./pages/Home'))
const Resume = lazy(() => import('./pages/Resume'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const Contact = lazy(() => import('./pages/Contact'))

// Loading fallback component
const PageLoader: FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-mario-bg-1 to-mario-bg-2 flex items-center justify-center">
    <div className="text-gameboy-darkest font-gameboy text-center">
      <div className="text-lg mb-2">MARIO</div>
      <div className="text-xs">Loading...</div>
      <div className="flex justify-center space-x-1 mt-2">
        <div className="w-2 h-2 bg-gameboy-darkest rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gameboy-darkest rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gameboy-darkest rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
)

const App: FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App