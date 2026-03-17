import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store'
import { playPop, playCorrect, playClick, playWhoosh } from '../utils/sounds'
import RobotAvatar from './RobotAvatar'

const ITEMS = [
  { id: 'bag',        emoji: '🎒', label: 'School Bag',           msg: "First things first — grab your school bag! Everything goes inside this! 🎒" },
  { id: 'books',      emoji: '📚', label: 'Textbooks',            msg: "Books = brain food! Grab the ones you need today! 📚" },
  { id: 'notebook',   emoji: '📓', label: 'Notebook',             msg: "Your brilliant ideas live here! Don't leave your notebook behind! 📓" },
  { id: 'pencil',     emoji: '✏️', label: 'Pencil Case',          msg: "Can't draw robots without pencils! Toss in your pencil case! ✏️" },
  { id: 'geometry',   emoji: '📐', label: 'Geometry Box',         msg: "Rulers, compass, protractor — math class is counting on you! 📐" },
  { id: 'homework',   emoji: '📄', label: 'Homework / Assignment', msg: "Teacher alert! 🚨 Your homework is waiting — pack it NOW! 📄" },
  { id: 'id',         emoji: '🪪', label: 'School ID Card',        msg: "You need your ID to enter school! Don't you dare forget it! 🪪" },
  { id: 'permission', emoji: '📋', label: 'Permission Slip',       msg: "Got a trip or event today? Slip it in! 📋" },
  { id: 'lunch',      emoji: '🍱', label: 'Lunch Box',             msg: "A hungry inventor can't build robots! Pack that delicious lunch! 🍱" },
  { id: 'water',      emoji: '💧', label: 'Water Bottle',          msg: "Staying hydrated = GIANT brain power! Fill it up and pack it! 💧" },
  { id: 'jacket',     emoji: '🧥', label: 'Jacket / Sweater',      msg: "It might get chilly! Throw in your jacket just in case! 🧥" },
  { id: 'medicine',   emoji: '💊', label: 'Medicine (if needed)',   msg: "Health comes first! Don't forget your medicine if you need it! 💊" },
]

const ALARM_INTERVAL_MS = 4 * 60 * 1000 // ring alarm every 4 minutes until all packed

export default function SmartReminder() {
  const { packedItems, togglePackedItem, clearPackedItems, darkMode, soundEnabled } = useStore()
  const [open, setOpen] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showAlarm, setShowAlarm] = useState(false)  // floating alarm bubble
  const [done, setDone] = useState(false)             // all-done celebration screen
  const alarmTimer = useRef(null)
  const alarmDismissTimer = useRef(null)

  const totalPacked = packedItems.length
  const allPacked = totalPacked >= ITEMS.length

  // Keep currentIdx pointing at first unpacked item when opening
  useEffect(() => {
    if (open) {
      if (allPacked) { setDone(true); return }
      setDone(false)
      // If currentIdx item is already packed, advance to first unpacked
      const firstUnpacked = ITEMS.findIndex(i => !packedItems.includes(i.id))
      if (firstUnpacked >= 0) setCurrentIdx(firstUnpacked)
    }
  }, [open]) // eslint-disable-line

  // Periodic alarm bubble (fires when not open and items remain)
  useEffect(() => {
    clearInterval(alarmTimer.current)
    if (!allPacked) {
      const fire = () => {
        if (!open) {
          setShowAlarm(true)
          if (soundEnabled) playPop()
          clearTimeout(alarmDismissTimer.current)
          alarmDismissTimer.current = setTimeout(() => setShowAlarm(false), 7000)
        }
      }
      const init = setTimeout(fire, 15000)        // first alarm after 15s
      alarmTimer.current = setInterval(fire, ALARM_INTERVAL_MS)
      return () => { clearInterval(alarmTimer.current); clearTimeout(init); clearTimeout(alarmDismissTimer.current) }
    }
  }, [allPacked, open, soundEnabled])

  const handleDone = () => {
    if (soundEnabled) playCorrect()
    const item = ITEMS[currentIdx]
    if (!packedItems.includes(item.id)) togglePackedItem(item.id)

    const nextIdx = ITEMS.findIndex((i, idx) => idx > currentIdx && !packedItems.includes(i.id) && i.id !== item.id)
    if (nextIdx >= 0) {
      setCurrentIdx(nextIdx)
    } else {
      // Check if truly all are packed now (after the one we just toggled)
      const remaining = ITEMS.filter(i => i.id !== item.id && !packedItems.includes(i.id))
      if (remaining.length === 0) {
        setDone(true)
      } else {
        // Find any remaining from beginning
        const fromStart = ITEMS.findIndex(i => i.id !== item.id && !packedItems.includes(i.id))
        if (fromStart >= 0) setCurrentIdx(fromStart)
        else setDone(true)
      }
    }
  }

  const handleSkip = () => {
    if (soundEnabled) playClick()
    const nextIdx = ITEMS.findIndex((i, idx) => idx > currentIdx && !packedItems.includes(i.id))
    if (nextIdx >= 0) {
      setCurrentIdx(nextIdx)
    } else {
      // wrap to first unpacked from top
      const fromStart = ITEMS.findIndex(i => !packedItems.includes(i.id) && ITEMS.indexOf(i) !== currentIdx)
      if (fromStart >= 0) setCurrentIdx(fromStart)
    }
  }

  const handleStartOver = () => {
    if (soundEnabled) playWhoosh()
    clearPackedItems()
    setDone(false)
    setCurrentIdx(0)
  }

  const handleOpen = () => {
    if (soundEnabled) playPop()
    setShowAlarm(false)
    setOpen(o => !o)
  }

  const progress = Math.round((totalPacked / ITEMS.length) * 100)
  const currentItem = ITEMS[currentIdx] || ITEMS[0]
  const unpackedItems = ITEMS.filter(i => !packedItems.includes(i.id))

  return (
    <>
      {/* Floating alarm bubble — shows next item to pack */}
      <AnimatePresence>
        {showAlarm && !open && !allPacked && (
          <motion.div
            key="alarm-bubble"
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.85 }}
            className={`fixed bottom-24 left-4 z-[99] max-w-[270px] rounded-2xl shadow-2xl overflow-hidden cursor-pointer`}
            onClick={() => { setShowAlarm(false); setOpen(true) }}
          >
            {/* Alarm header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 flex items-center gap-2">
              <motion.span
                animate={{ rotate: [-20, 20, -20, 20, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.5 }}
                className="text-xl"
              >
                🔔
              </motion.span>
              <span className="text-white font-bold text-sm">⚡ Sparky's Pack Alarm!</span>
              <button
                onClick={e => { e.stopPropagation(); setShowAlarm(false) }}
                className="ml-auto text-white/70 hover:text-white text-sm"
              >✕</button>
            </div>
            {/* Body */}
            <div className={`px-4 py-3 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
              <div className="flex items-center gap-3 mb-2">
                <motion.span
                  className="text-4xl"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  {unpackedItems[0]?.emoji}
                </motion.span>
                <div>
                  <p className="font-bold text-base">{unpackedItems[0]?.label}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {totalPacked}/{ITEMS.length} items packed
                  </p>
                </div>
              </div>
              <p className={`text-xs leading-snug ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {unpackedItems[0]?.msg}
              </p>
              <p className={`text-xs mt-2 font-semibold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                Tap to open Pack Alarm →
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={handleOpen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-4 left-4 z-[100] w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-xl transition-colors ${
          allPacked
            ? 'bg-gradient-to-br from-emerald-500 to-green-500'
            : 'bg-gradient-to-br from-orange-500 to-red-500'
        }`}
        animate={showAlarm && !open ? { y: [0, -5, 0] } : {}}
        transition={{ duration: 0.5, repeat: showAlarm && !open ? Infinity : 0 }}
      >
        <motion.span
          className="text-2xl"
          animate={showAlarm && !open ? { rotate: [-20, 20, -20, 20, 0] } : {}}
          transition={{ duration: 0.5, repeat: showAlarm && !open ? Infinity : 0, repeatDelay: 1.5 }}
        >
          {allPacked ? '✅' : '🔔'}
        </motion.span>
        <span className="text-[9px] font-bold text-white leading-none">
          {totalPacked}/{ITEMS.length}
        </span>
        {!allPacked && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-[9px] text-gray-900 flex items-center justify-center font-bold"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            {ITEMS.length - totalPacked}
          </motion.div>
        )}
      </motion.button>

      {/* Main alarm panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="alarm-panel"
            initial={{ opacity: 0, x: -340, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -340, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className={`fixed bottom-4 left-20 z-[100] w-80 rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
              darkMode ? 'bg-gray-900 border border-orange-500/30' : 'bg-white border border-orange-200'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-8 h-8 pointer-events-none"
                    animate={{ rotate: [0, -15, 15, -15, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <RobotAvatar emotion="excited" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Sparky's Pack Alarm</h3>
                    <p className="text-white/70 text-xs">Pack one item at a time!</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center text-sm hover:bg-white/30"
                >✕</button>
              </div>
              {/* Progress bar */}
              <div className="mt-2">
                <div className="flex justify-between text-xs text-white/80 mb-1">
                  <span>{totalPacked}/{ITEMS.length} packed</span>
                  <span className="font-bold">{progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-white"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 flex-1">
              <AnimatePresence mode="wait">
                {done || allPacked ? (
                  /* ── All Done screen ── */
                  <motion.div
                    key="all-done"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      className="text-6xl mb-3"
                      animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    >
                      🎉
                    </motion.div>
                    <h4 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      ALL PACKED!
                    </h4>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      My sensors detect ZERO missing items! You're ready to conquer the day! 🚀
                    </p>
                    {/* Mini list of what was packed */}
                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {ITEMS.map(i => (
                        <span key={i.id} className="text-lg" title={i.label}>{i.emoji}</span>
                      ))}
                    </div>
                    <button
                      onClick={handleStartOver}
                      className={`w-full py-2 rounded-xl text-xs font-bold border-2 transition-colors ${
                        darkMode
                          ? 'border-gray-700 text-gray-400 hover:bg-gray-800'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      🔄 Start Over for Tomorrow
                    </button>
                  </motion.div>
                ) : (
                  /* ── Current Item alarm card ── */
                  <motion.div
                    key={currentItem.id}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  >
                    {/* Step counter dots */}
                    <div className="flex gap-1 mb-3 flex-wrap">
                      {ITEMS.map((item, idx) => (
                        <div
                          key={item.id}
                          className={`h-1.5 flex-1 min-w-[12px] rounded-full transition-all duration-300 ${
                            packedItems.includes(item.id)
                              ? 'bg-emerald-400'
                              : idx === currentIdx
                              ? 'bg-orange-400'
                              : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Big item card */}
                    <div className={`rounded-2xl p-5 text-center mb-4 ${
                      darkMode
                        ? 'bg-gradient-to-b from-gray-800 to-gray-800/50 border border-orange-500/20'
                        : 'bg-gradient-to-b from-orange-50 to-white border-2 border-orange-200'
                    }`}>
                      {/* Alarm animation on emoji */}
                      <motion.div
                        className="text-6xl mb-3"
                        animate={{ scale: [1, 1.12, 1], rotate: [-3, 3, -3, 3, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
                      >
                        {currentItem.emoji}
                      </motion.div>
                      <div className={`text-xs font-semibold uppercase tracking-widest mb-1 ${darkMode ? 'text-orange-400' : 'text-orange-500'}`}>
                        🔔 Pack this now!
                      </div>
                      <h4 className={`font-extrabold text-xl mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {currentItem.label}
                      </h4>
                      <p className={`text-sm leading-snug ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {currentItem.msg}
                      </p>
                    </div>

                    {/* Step label */}
                    <p className={`text-center text-xs mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Item {ITEMS.filter((_,i)=> i<=currentIdx || packedItems.includes(ITEMS[i].id)).length} of {ITEMS.length}
                      {unpackedItems.length > 1 && <span> · {unpackedItems.length - 1} more to go</span>}
                    </p>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        onClick={handleDone}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/20"
                      >
                        ✅ Packed! Next →
                      </motion.button>
                      {unpackedItems.length > 1 && (
                        <button
                          onClick={handleSkip}
                          className={`px-3 py-3 rounded-xl text-xs font-bold transition-colors ${
                            darkMode
                              ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          title="Skip to next item"
                        >
                          Skip
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
