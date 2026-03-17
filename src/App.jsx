import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useStore from './store'
import NavbarProgress from './components/NavbarProgress'
import LandingPage from './components/LandingPage'
import Module1Intro from './components/Module1Intro'
import WatchLearn from './components/WatchLearn'
import Quiz from './components/Quiz'
import ProblemStatement from './components/ProblemStatement'
import RobotBuilder from './components/RobotBuilder'
import DrawingCanvas from './components/DrawingCanvas'
import FlyerPreview from './components/FlyerPreview'
import Presentation from './components/Presentation'
import BrowniePoints from './components/BrowniePoints'
import KeyTakeaways from './components/KeyTakeaways'
import RobotBuddy from './components/RobotBuddy'
import AchievementToast from './components/AchievementToast'
import CursorTrail from './components/CursorTrail'
import ClickBurst from './components/ClickBurst'
import MatrixRain from './components/MatrixRain'
import KonamiEasterEgg from './components/KonamiEasterEgg'
import ParticleField from './components/ParticleField'
import SmartReminder from './components/SmartReminder'
import { playWhoosh } from './utils/sounds'

const steps = [
  { component: LandingPage, label: 'Welcome' },
  { component: Module1Intro, label: 'Discover' },
  { component: WatchLearn, label: 'Watch & Learn' },
  { component: Quiz, label: 'Quiz' },
  { component: ProblemStatement, label: 'Problem' },
  { component: RobotBuilder, label: 'Build Robot' },
  { component: DrawingCanvas, label: 'Draw' },
  { component: FlyerPreview, label: 'Flyer' },
  { component: Presentation, label: 'Present' },
  { component: BrowniePoints, label: 'Points' },
  { component: KeyTakeaways, label: 'Takeaways' },
]

function App() {
  const { currentStep, darkMode, soundEnabled, xp, getLevel, getNextLevel } = useStore()
  const [direction, setDirection] = useState(1)
  const [prevStep, setPrevStep] = useState(currentStep)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Track transition direction
  useEffect(() => {
    setDirection(currentStep > prevStep ? 1 : -1)
    setPrevStep(currentStep)
    if (soundEnabled && currentStep > 0) playWhoosh()
  }, [currentStep])

  const StepComponent = steps[currentStep]?.component || LandingPage
  const level = getLevel()
  const nextLevel = getNextLevel()
  const xpProgress = nextLevel
    ? ((xp - level.xpNeeded) / (nextLevel.xpNeeded - level.xpNeeded)) * 100
    : 100

  // Floating glow orbs
  const orbs = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      left: `${10 + i * 20}%`,
      top: `${15 + (i % 3) * 30}%`,
      size: 100 + Math.random() * 150,
      duration: 6 + Math.random() * 6,
      color: ['rgba(6,182,212,0.12)', 'rgba(16,185,129,0.1)', 'rgba(245,158,11,0.08)', 'rgba(139,92,246,0.1)', 'rgba(236,72,153,0.08)'][i],
    })),
  [])

  // Page transition variants (slide + scale)
  const pageVariants = {
    initial: { opacity: 0, x: direction * 80, scale: 0.95, filter: 'blur(4px)' },
    animate: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, x: direction * -80, scale: 0.95, filter: 'blur(4px)' },
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${darkMode ? 'circuit-bg text-gray-100' : 'circuit-bg-light text-gray-800'}`}>
      {/* Animated matrix rain background */}
      <MatrixRain darkMode={darkMode} />

      {/* Interactive particle field */}
      <ParticleField darkMode={darkMode} />

      {/* Floating glow orbs */}
      {orbs.map(o => (
        <div
          key={o.id}
          className="glow-orb"
          style={{
            left: o.left,
            top: o.top,
            width: o.size,
            height: o.size,
            backgroundColor: o.color,
            animationDuration: `${o.duration}s`,
          }}
        />
      ))}

      {/* Cursor sparkle trail */}
      <CursorTrail />

      {/* Click-anywhere particle burst */}
      <ClickBurst />

      {/* Konami code easter egg */}
      <KonamiEasterEgg />

      <NavbarProgress steps={steps} />

      {/* XP Level Bar */}
      <div className={`fixed top-[60px] left-0 right-0 z-40 ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-sm border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center gap-3">
          <span className="text-lg">{level.emoji}</span>
          <span className={`text-xs font-bold font-mono ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>
            Lv.{level.level} {level.name}
          </span>
          <div className={`flex-1 h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <motion.div
              className="h-full rounded-full xp-bar-shimmer"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className={`text-[10px] font-mono ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {xp} XP {nextLevel ? `/ ${nextLevel.xpNeeded}` : '(MAX)'}
          </span>
        </div>
      </div>

      <main className="pt-28 pb-10 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </main>

      <RobotBuddy />
      <SmartReminder />
      <AchievementToast darkMode={darkMode} />
    </div>
  )
}

export default App
