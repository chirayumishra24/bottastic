import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store'
import { playClick, playCorrect } from '../utils/sounds'
import { triggerToast } from './AchievementToast'
import RobotAvatar from './RobotAvatar'
import TechIcon from './TechIcon'

const constraints = [
  { icon: 'mask', title: 'Personality', desc: 'Give your robot a unique character' },
  { icon: 'sliders', title: 'Features', desc: 'Choose 2–3 smart capabilities' },
  { icon: 'party', title: 'Fun Elements', desc: 'Add emojis, sounds & humor' },
]

const teamNameOptions = [
  'Robo Rangers 🤖',
  'Tech Titans ⚡',
  'Circuit Squad 🔌',
  'Gadget Gurus 🛠️',
  'Bot Builders 🏗️',
  'Cyber Crew 💻',
  'Innovation Station 🚀',
  'The Code Breakers 🔓',
]

const memberRoleOptions = [
  'Team Leader 👑',
  'Designer 🎨',
  'Builder 🔧',
  'Presenter 🎤',
]

export default function ProblemStatement() {
  const { teamInfo, setTeamName, setTeamMember, setCurrentStep, darkMode, soundEnabled, addXP, unlockAchievement } = useStore()
  const xpGranted = useRef(false)

  useEffect(() => {
    const hasTeamName = teamInfo.name.length > 0
    const hasMembers = teamInfo.members.filter(m => m.length > 0).length >= 2
    if (!xpGranted.current && hasTeamName && hasMembers) {
      xpGranted.current = true
      addXP(6)
      if (soundEnabled) playCorrect()
      if (unlockAchievement('squad-formed')) {
        triggerToast('Squad Assembled!', 'Team is ready for the mission!', '\u{1F91D}')
      }
    }
  }, [teamInfo])

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <span className="text-5xl">⚡</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">
          <span className={`bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent ${darkMode ? 'neon-text' : ''}`}>
            Mission Briefing
          </span>
        </h2>
        <p className={`mt-2 font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          [Module 2.1] – Problem Statement
        </p>
      </motion.div>

      {/* Problem Statement */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-lg shadow-lg text-center mb-8 ${darkMode ? 'bg-gradient-to-r from-cyan-900 to-emerald-900 text-cyan-100 neon-glow-cyan' : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white'}`}
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-3">🎯 Primary Directive</h3>
        <p className="text-lg md:text-xl font-medium opacity-95">
          "Design a Lost & Found Helper Robot that makes your school a better place!"
        </p>
      </motion.div>

      {/* Design Constraints */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-lg mb-8 ${darkMode ? 'robo-card' : 'robo-card-light shadow-md'}`}
      >
        <h3 className="text-xl font-bold mb-4">🔧 Design Parameters</h3>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Your robot must include these three elements:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {constraints.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className={`p-4 rounded-lg text-center ${
                darkMode ? 'bg-gray-900/50 border border-cyan-500/10' : 'bg-gradient-to-b from-cyan-50 to-emerald-50'
              }`}
            >
              <div className="text-4xl mb-2 flex justify-center text-cyan-500">
                <TechIcon type={c.icon} className="w-10 h-10" />
              </div>
              <div className="font-bold">{c.title}</div>
              <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{c.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Example Robot Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className={`p-6 rounded-lg mb-8 border-2 border-dashed ${
          darkMode ? 'robo-card border-cyan-500/30' : 'robo-card-light border-cyan-300'
        }`}
      >
        <h3 className="text-lg font-bold mb-3">💡 Example Unit</h3>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 pointer-events-none">
              <RobotAvatar emotion="thinking" />
            </div>
          </div>
          <h4 className="font-bold text-cyan-500">Lost & Found Legend Bot</h4>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium dark:bg-blue-900/30 dark:text-blue-300">
              🔔 Smart Alert
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium dark:bg-green-900/30 dark:text-green-300">
              🔍 Owner Finder
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium dark:bg-yellow-900/30 dark:text-yellow-300">
              😂 Funny Reminder
            </span>
          </div>
          <p className={`text-sm mt-2 italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            "Your bottle misses you! 🧴💔"
          </p>
        </div>
      </motion.div>

      {/* Team Setup */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className={`p-6 rounded-lg mb-8 ${darkMode ? 'robo-card' : 'robo-card-light shadow-md'}`}
      >
        <h3 className="text-xl font-bold mb-4">👥 Squad Setup</h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Team Name
            </label>
            <select
              value={teamInfo.name}
              onChange={(e) => { setTeamName(e.target.value); if (soundEnabled) playClick() }}
              className={`w-full p-3 rounded-lg border-2 transition-colors outline-none font-mono cursor-pointer ${
                darkMode
                  ? 'bg-gray-900/50 border-cyan-500/20 focus:border-cyan-500 text-cyan-100'
                  : 'bg-gray-50 border-gray-300 focus:border-cyan-500'
              }`}
            >
              <option value="">– Choose a team name –</option>
              {teamNameOptions.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {teamInfo.members.map((member, i) => (
              <div key={i}>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Member {i + 1} – Role
                </label>
                <select
                  value={member}
                  onChange={(e) => { setTeamMember(i, e.target.value); if (soundEnabled) playClick() }}
                  className={`w-full p-3 rounded-lg border-2 transition-colors outline-none font-mono cursor-pointer ${
                    darkMode
                      ? 'bg-gray-900/50 border-cyan-500/20 focus:border-cyan-500 text-cyan-100'
                      : 'bg-gray-50 border-gray-300 focus:border-cyan-500'
                  }`}
                >
                  <option value="">– Assign role –</option>
                  {memberRoleOptions.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(3)}
          className={`px-6 py-3 rounded-lg font-medium font-mono transition-colors ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          ◀ Back
        </button>
        <button
          onClick={() => setCurrentStep(5)}
          className={`px-6 py-3 font-medium font-mono rounded-lg transition-all ${
            darkMode
              ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-black hover:shadow-[0_0_15px_rgba(0,255,200,0.3)]'
              : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white hover:shadow-lg'
          }`}
        >
          Next: Build Your Robot! ▶
        </button>
      </div>
    </div>
  )
}
