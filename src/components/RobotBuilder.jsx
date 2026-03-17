import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store'
import { playClick, playPop, playSuccess } from '../utils/sounds'
import { triggerToast } from './AchievementToast'
import { RobotHeads, RobotBodies, RobotArms, RobotBases } from './RobotParts'

// Colors for the "Paint" tab
const colors = [
  { id: 'cyan', hex: '#22d3ee', name: 'Cyber Cyan' },
  { id: 'red', hex: '#f87171', name: 'Rescue Red' },
  { id: 'green', hex: '#4ade80', name: 'Go Green' },
  { id: 'purple', hex: '#a78bfa', name: 'Power Purple' },
  { id: 'orange', hex: '#fb923c', name: 'Orbital Orange' },
  { id: 'yellow', hex: '#facc15', name: 'Solar Yellow' },
  { id: 'pink', hex: '#f472b6', name: 'Neon Pink' },
  { id: 'gray', hex: '#9ca3af', name: 'Stealth Gray' },
]

// Available parts for the "Parts" tab
const partOptions = {
  heads: Object.keys(RobotHeads),
  bodies: Object.keys(RobotBodies),
  arms: Object.keys(RobotArms),
  bases: Object.keys(RobotBases),
}

export default function RobotBuilder() {
  const { robotData, setRobotField, setCurrentStep, darkMode, addXP, unlockAchievement } = useStore()
  const xpGiven = useRef(false)
  
  // Local state for visual builder configuration
  const [config, setConfig] = useState({
    head: 'standard',
    body: 'box',
    arms: 'basic',
    base: 'legs',
    color: '#22d3ee'
  })
  
  const [activeTab, setActiveTab] = useState('parts') // 'parts', 'paint', 'system'

  // Grant XP when robot has at least a name and personality
  useEffect(() => {
    if (!xpGiven.current && robotData.name && robotData.personality) {
      xpGiven.current = true
      const leveled = addXP(12)
      if (unlockAchievement('robot-built')) {
        triggerToast('Robot Inventor! 🤖', 'Built your first robot!', '🔧')
      }
      if (leveled) triggerToast('LEVEL UP! 🎉', 'You reached a new rank!', '⬆️')
    }
  }, [robotData, addXP, unlockAchievement])

  // Automatically update legacy "features" in the store based on visual parts
  // This ensures the Flyer/Poster step has data to display even if we don't pick it manually.
  useEffect(() => {
    const newFeatures = []
    if (config.head === 'radar') newFeatures.push('scanner')
    if (config.head === 'smart') newFeatures.push('alert-system')
    if (config.base === 'wheels') newFeatures.push('high-speed')
    if (config.base === 'hover') newFeatures.push('flight')
    if (config.arms === 'magnet') newFeatures.push('magnetic-grip')
    if (config.arms === 'clamp') newFeatures.push('heavy-lifting')
    
    // Also generate a description if one isn't set manually
    const autoDesc = `A ${config.color} robot with ${config.head} sensors and ${config.base} propulsion.`
    if (!robotData.description) {
      setRobotField('description', autoDesc)
    }
  }, [config, setRobotField, robotData.description])


  const handlePartChange = (type, value) => {
    playClick()
    setConfig(prev => ({ ...prev, [type]: value }))
  }

  const handleColorChange = (hex) => {
    playPop()
    setConfig(prev => ({ ...prev, color: hex }))
  }

  // Calculate "stats" dynamically based on parts (Game-like feedback)
  const stats = {
    speed: (config.base === 'wheels' ? 90 : config.base === 'hover' ? 85 : 60),
    range: (config.head === 'radar' ? 95 : config.head === 'smart' ? 85 : 50),
    power: (config.body === 'box' ? 90 : config.body === 'triangle' ? 70 : 60),
    utility: (config.arms === 'magnet' ? 90 : config.arms === 'clamp' ? 85 : 50)
  }

  // Resolve the actual React components from the dictionaries in RobotParts
  const HeadComponent = RobotHeads[config.head]
  const BodyComponent = RobotBodies[config.body]
  const ArmsComponent = RobotArms[config.arms]
  const BaseComponent = RobotBases[config.base]

  return (
    <div className={`h-[calc(100vh-140px)] min-h-[600px] flex flex-col md:flex-row gap-6 p-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      
      {/* LEFT: Simulation Preview (The Visualization) */}
      <div className="flex-1 flex flex-col relative">
        <div className={`relative flex-1 rounded-3xl overflow-hidden border-4 shadow-2xl flex items-center justify-center
          ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-slate-100 border-white'} 
          transition-colors duration-500`}
        >
          
          {/* animated grid background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-1000" 
               style={{ 
                 backgroundImage: `linear-gradient(${darkMode ? '#22d3ee' : '#cbd5e1'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? '#22d3ee' : '#cbd5e1'} 1px, transparent 1px)`, 
                 backgroundSize: '40px 40px',
                 perspective: '1000px'
               }} 
          />
          
          {/* The Robot Composition */}
          <motion.div 
            className="relative w-72 h-96 filter drop-shadow-2xl z-10"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            key={config.head + config.body + config.base + config.arms + config.color}
          >
            <svg viewBox="0 0 100 120" className="w-full h-full overflow-visible">
              <g className="robot-assembly">
                 {/* Z-Index layering: Base -> Body -> Arms -> Head */}
                 <BaseComponent color={config.color} />
                 <BodyComponent color={config.color} />
                 <ArmsComponent color={config.color} />
                 <g transform="translate(0, -2)">
                    <HeadComponent color={config.color} />
                 </g>
              </g>
            </svg>
          </motion.div>

          {/* HUD Overlay Stats */}
          <div className="absolute top-6 right-6 flex flex-col gap-3 w-40 z-20">
             {Object.entries(stats).map(([label, val]) => (
               <div key={label} className="bg-black/60 backdrop-blur-md rounded-lg p-2 border border-white/10 shadow-lg">
                 <div className="flex justify-between text-[10px] uppercase font-bold mb-1 tracking-wider text-cyan-300">
                    {label} <span className="text-white">{val}%</span>
                 </div>
                 <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                   <motion.div 
                     className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                     initial={{ width: 0 }}
                     animate={{ width: `${val}%` }}
                     transition={{ duration: 1, ease: "easeOut" }}
                   />
                 </div>
               </div>
             ))}
          </div>

          <div className="absolute bottom-6 left-6 font-mono text-xs opacity-60 z-20 bg-black/40 backdrop-blur px-3 py-2 rounded border border-white/10">
             <div className="text-cyan-400 font-bold mb-1">● SIMULATION ACTIVE</div>
             <div>UNIT: {robotData.name?.toUpperCase() || 'UNNAMED_BOT_V1'}</div>
             <div>CORE: {robotData.personality?.toUpperCase() || 'PENDING_INSTALL'}</div>
          </div>
        </div>
      </div>

      {/* RIGHT: Tool Panel (The Controls) */}
      <div className={`w-full md:w-[400px] flex flex-col rounded-3xl border-2 overflow-hidden shadow-2xl
         ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-white'}
      `}>
        
        {/* Helper Header */}
        <div className={`p-5 border-b flex justify-between items-center ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
           <h3 className="font-bold text-xl flex items-center gap-2">
             🛠️ BuilderStation
           </h3>
           <div className="text-xs font-mono opacity-50">v2.4.0</div>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          {[
            { id: 'parts', label: 'Comp', icon: '🧩' },
            { id: 'paint', label: 'Paint', icon: '🎨' },
            { id: 'system', label: 'System', icon: '💾' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { playClick(); setActiveTab(tab.id); }}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-cyan-500/10 text-cyan-500 border-b-2 border-cyan-500' 
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <span className="text-lg block mb-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel Content Area */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          
          <AnimatePresence mode="wait">
            
            {/* PARTS TAB */}
            {activeTab === 'parts' && (
              <motion.div 
                key="parts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {Object.entries(partOptions).map(([category, parts]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold uppercase opacity-50 tracking-widest">{category}</label>
                        <span className="text-[10px] font-mono opacity-30">Select Module</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {parts.map(part => {
                         const isSelected = config[category.replace(/s$/, '')] === part;
                         return (
                          <button
                            key={part}
                            onClick={() => handlePartChange(category.replace(/s$/, ''), part)} // heads -> head
                            className={`p-3 rounded-xl border-2 text-xs font-bold capitalize transition-all duration-200 ${
                              isSelected
                                ? 'border-cyan-500 bg-cyan-500/20 text-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.2)] scale-105' 
                                : `border-transparent ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} opacity-70 hover:opacity-100`
                            }`}
                          >
                            {part}
                          </button>
                         )
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* PAINT TAB */}
            {activeTab === 'paint' && (
              <motion.div 
                key="paint"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <label className="text-xs font-bold uppercase opacity-50 tracking-widest mb-4 block">Chassis Coating</label>
                <div className="grid grid-cols-3 gap-4">
                  {colors.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleColorChange(c.hex)}
                      className={`aspect-square rounded-2xl border-4 flex items-center justify-center transition-all duration-300 relative overflow-hidden group ${
                        config.color === c.hex ? 'border-white scale-110 shadow-xl' : 'border-transparent hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {config.color === c.hex && (
                        <motion.span 
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="text-2xl drop-shadow-md"
                        >
                            ✓
                        </motion.span>
                      )}
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SYSTEM TAB */}
            {activeTab === 'system' && (
              <motion.div 
                  key="system"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 h-full flex flex-col"
              >
                <div className="space-y-5 flex-1">
                  <div>
                    <label className="block text-xs font-bold uppercase opacity-70 mb-2">Unit Designation</label>
                    <input 
                      type="text" 
                      value={robotData.name}
                      onChange={(e) => setRobotField('name', e.target.value)}
                      placeholder="e.g. XR-71 OMEGA"
                      className={`w-full p-4 rounded-xl border-2 bg-transparent outline-none font-bold font-mono tracking-wider focus:border-cyan-500 transition-colors ${darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`} 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase opacity-70 mb-2">AI Core Personality</label>
                    <div className="relative">
                      <select
                          value={robotData.personality}
                          onChange={(e) => setRobotField('personality', e.target.value)}
                          className={`w-full p-4 rounded-xl border-2 bg-transparent outline-none appearance-none font-bold focus:border-cyan-500 transition-colors ${darkMode ? 'border-gray-700 bg-gray-900/50 text-gray-100' : 'border-gray-200 bg-gray-50 text-gray-800'}`} 
                      >
                          <option value="">Select AI Core...</option>
                          <option value="friendly">🤗 Friendly Helper</option>
                          <option value="detective">🕵️ Investigator</option>
                          <option value="speedy">⚡ Speed Runner</option>
                          <option value="logic">🧠 Logic Master</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase opacity-70 mb-2">Mission Tagline</label>
                    <input 
                      type="text" 
                      value={robotData.tagline}
                      onChange={(e) => setRobotField('tagline', e.target.value)}
                      placeholder="e.g. Seeking lost items!"
                      className={`w-full p-4 rounded-xl border-2 bg-transparent outline-none font-medium focus:border-cyan-500 transition-colors ${darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`} 
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-700/20">
                  <div className="flex gap-4">
                    <button
                        onClick={() => setCurrentStep(4)}
                        className={`px-4 py-4 rounded-xl font-bold border-2 transition-all ${darkMode ? 'border-gray-700 hover:bg-gray-700 text-gray-400' : 'border-gray-200 hover:bg-gray-100 text-gray-600'}`}
                    >
                        ◀ 
                    </button>
                    <button
                      onClick={() => { playSuccess(); setCurrentStep(prev => prev + 1); }}
                      disabled={!robotData.name || !robotData.personality}
                      className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${
                          !robotData.name || !robotData.personality
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl hover:scale-[1.02] hover:shadow-cyan-500/25 active:scale-[0.98]'
                      }`}
                    >
                      Initialize Unit 🚀
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}