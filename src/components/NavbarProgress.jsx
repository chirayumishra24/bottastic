import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store'
import RobotAvatar from './RobotAvatar'

export default function NavbarProgress({ steps }) {
  const { currentStep, setCurrentStep, darkMode, toggleDarkMode, soundEnabled, toggleSound } = useStore()
  const [isFullscreen, setIsFullscreen] = useState(false)

  const progress = ((currentStep) / (steps.length - 1)) * 100

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
            console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? 'bg-[#0a0e17]/95 border-b border-cyan-500/20' : 'bg-[#e8edf5]/95 border-b border-slate-300'} backdrop-blur-sm shadow-lg`}>
      {/* Progress bar */}
      <div className={`h-1.5 ${darkMode ? 'bg-gray-800' : 'bg-gray-300'}`}>
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 rounded-r-full neon-glow"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 pointer-events-none">
            <RobotAvatar emotion="happy" />
          </div>
          <h1 className="text-sm md:text-lg font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Bot-tastic School Buddy
          </h1>
        </div>

        {/* Step indicators - hidden on mobile */}
        <div className="hidden lg:flex items-center gap-1">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`px-2 py-1 text-xs rounded-md transition-all duration-200 font-mono ${
                i === currentStep
                  ? 'bg-cyan-500 text-black scale-110 shadow-md neon-glow-cyan'
                  : i < currentStep
                  ? darkMode ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-700'
                  : darkMode
                  ? 'bg-gray-800 text-gray-500 hover:bg-gray-700 border border-gray-700'
                  : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
              }`}
              title={step.label}
            >
              {i < currentStep ? '✓' : i + 1}
            </button>
          ))}
        </div>

        {/* Mobile step indicator + Dark mode */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-medium ${darkMode ? 'text-cyan-400' : 'text-gray-600'}`}>
            [{currentStep + 1}/{steps.length}]
          </span>
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-md transition-colors text-sm ${darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            )}
          </button>
          <button
            onClick={toggleSound}
            className={`p-2 rounded-md transition-colors text-sm ${darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
            title="Toggle sounds"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-md transition-colors ${darkMode ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            title="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  )
}
