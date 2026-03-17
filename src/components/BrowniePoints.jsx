import { useEffect } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store'
import { playClick } from '../utils/sounds'

const badges = [
  { points: 5, emoji: '🏆', title: 'Curious Thinker' },
  { points: 10, emoji: '🌟', title: 'Super Questioner' },
  { points: 15, emoji: '🎖️', title: 'Discussion Champion' },
  { points: 20, emoji: '👑', title: 'Knowledge King/Queen' },
]

export default function BrowniePoints() {
  const { browniePoints, setCurrentStep, darkMode, soundEnabled, xp, getLevel, getNextLevel } = useStore()
  const level = getLevel()
  const nextLevel = getNextLevel()

  useEffect(() => {
    if (browniePoints >= 5) {
      import('canvas-confetti').then((mod) => {
        const confetti = mod.default
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
      }).catch(() => {})
    }
  }, [])

  const nextBadge = badges.find(b => b.points > browniePoints) || badges[badges.length - 1]
  const earnedBadges = badges.filter(b => b.points <= browniePoints)
  const progressToNext = nextBadge ? Math.min((browniePoints / nextBadge.points) * 100, 100) : 100

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <span className="text-5xl">⚡</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">
          <span className={`bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent ${darkMode ? 'neon-text' : ''}`}>
            Power Cores
          </span>
        </h2>
        <p className={`mt-2 font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Energy accumulated from curiosity!
        </p>
      </motion.div>

      {/* Points Counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-lg text-center mb-8 ${darkMode ? 'robo-card neon-glow' : 'robo-card-light shadow-lg'}`}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl font-extrabold text-cyan-400 mb-2"
        >
          {browniePoints}
        </motion.div>
        <p className={`text-lg font-medium font-mono ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Power Cores Collected
        </p>

        {/* XP Level Display */}
        <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-900/50 border border-cyan-500/10' : 'bg-cyan-50'}`}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl">{level.emoji}</span>
            <span className={`font-bold font-mono ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>
              Level {level.level}: {level.name}
            </span>
          </div>
          <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <motion.div
              className="h-full rounded-full xp-bar-shimmer"
              initial={{ width: 0 }}
              animate={{ width: `${nextLevel ? ((xp - level.xpNeeded) / (nextLevel.xpNeeded - level.xpNeeded)) * 100 : 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className={`text-xs mt-1 font-mono text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {xp} XP {nextLevel ? `• ${nextLevel.xpNeeded - xp} XP to ${nextLevel.name}` : '• MAX LEVEL!'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 max-w-sm mx-auto">
          <div className="flex justify-between text-xs mb-1">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Progress</span>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              {browniePoints}/{nextBadge?.points || '∞'}
            </span>
          </div>
          <div className={`h-4 rounded-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-md"
            />
          </div>
          {browniePoints < (nextBadge?.points || 0) && (
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {nextBadge.points - browniePoints} more to earn "{nextBadge.title}" badge!
            </p>
          )}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-lg mb-8 ${darkMode ? 'robo-card' : 'robo-card-light shadow-md'}`}
      >
        <h3 className="text-xl font-bold mb-4 text-center">🏅 Achievement Modules</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, i) => {
            const earned = browniePoints >= badge.points
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`p-4 rounded-lg text-center transition-all ${
                  earned
                    ? darkMode ? 'bg-cyan-900/20 border border-cyan-500/30 neon-glow-cyan shadow-md' : 'bg-gradient-to-b from-cyan-100 to-emerald-100 shadow-md'
                    : darkMode
                    ? 'bg-gray-900/50 opacity-50'
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className={`text-3xl mb-1 ${earned ? '' : 'grayscale filter'}`}>
                  {badge.emoji}
                </div>
                <div className={`text-xs font-bold ${earned ? 'text-cyan-600 dark:text-cyan-400' : ''}`}>
                  {badge.title}
                </div>
                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {badge.points} pts
                </div>
                {earned && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-emerald-500 text-xs mt-1 font-bold font-mono"
                  >
                    ✓ Earned!
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* How to earn */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className={`p-6 rounded-lg mb-8 border-2 border-dashed ${
          darkMode ? 'robo-card border-cyan-500/30' : 'robo-card-light border-cyan-300'
        }`}
      >
        <h3 className="text-lg font-bold mb-3">💡 How to Charge Up</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span>❓</span>
            <span className="text-sm">Submit a query during discussion = <span className="font-bold text-cyan-500">+1 core</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span>🏆</span>
            <span className="text-sm">Collect 5 cores = <span className="font-bold text-cyan-500">Curious Thinker module</span></span>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(8)}
          className={`px-6 py-3 rounded-lg font-medium font-mono transition-colors ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          ◀ Back
        </button>
        <button
          onClick={() => setCurrentStep(10)}
          className={`px-6 py-3 font-medium font-mono rounded-lg transition-all ${
            darkMode
              ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-black hover:shadow-[0_0_15px_rgba(0,255,200,0.3)]'
              : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white hover:shadow-lg'
          }`}
        >
          Next: Takeaways ▶
        </button>
      </div>
    </div>
  )
}
