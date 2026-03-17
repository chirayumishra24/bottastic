import { create } from 'zustand'

const loadFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* ignore quota errors */ }
}

const XP_LEVELS = [
  { level: 1, name: 'Cadet', xpNeeded: 0, emoji: '🔰' },
  { level: 2, name: 'Mechanic', xpNeeded: 15, emoji: '🔧' },
  { level: 3, name: 'Engineer', xpNeeded: 35, emoji: '⚙️' },
  { level: 4, name: 'Commander', xpNeeded: 60, emoji: '🎖️' },
  { level: 5, name: 'Legend', xpNeeded: 100, emoji: '👑' },
]

const useStore = create((set, get) => ({
  // Navigation
  currentStep: loadFromStorage('currentStep', 0),
  setCurrentStep: (step) => {
    set({ currentStep: step })
    saveToStorage('currentStep', step)
  },

  // Dark mode
  darkMode: loadFromStorage('darkMode', false),
  toggleDarkMode: () => {
    const newMode = !get().darkMode
    set({ darkMode: newMode })
    saveToStorage('darkMode', newMode)
  },

  // Sound on/off
  soundEnabled: loadFromStorage('soundEnabled', true),
  toggleSound: () => {
    const newVal = !get().soundEnabled
    set({ soundEnabled: newVal })
    saveToStorage('soundEnabled', newVal)
  },

  // XP & Level system
  xp: loadFromStorage('xp', 0),
  addXP: (amount) => {
    const newXP = get().xp + amount
    const oldLevel = get().getLevel()
    set({ xp: newXP })
    saveToStorage('xp', newXP)
    // Return true if leveled up
    const newLevel = XP_LEVELS.filter(l => newXP >= l.xpNeeded).pop()
    return newLevel && newLevel.level > oldLevel.level
  },
  getLevel: () => {
    const xp = get().xp
    return XP_LEVELS.filter(l => xp >= l.xpNeeded).pop() || XP_LEVELS[0]
  },
  getNextLevel: () => {
    const current = get().getLevel()
    return XP_LEVELS.find(l => l.level === current.level + 1) || null
  },
  xpLevels: XP_LEVELS,

  // Quiz streak
  quizStreak: loadFromStorage('quizStreak', 0),
  bestStreak: loadFromStorage('bestStreak', 0),
  setQuizStreak: (streak) => {
    const best = Math.max(streak, get().bestStreak)
    set({ quizStreak: streak, bestStreak: best })
    saveToStorage('quizStreak', streak)
    saveToStorage('bestStreak', best)
  },

  // Achievements
  achievements: loadFromStorage('achievements', []),
  unlockAchievement: (id) => {
    const current = get().achievements
    if (current.includes(id)) return false
    const updated = [...current, id]
    set({ achievements: updated })
    saveToStorage('achievements', updated)
    return true
  },

  // Reflections (Module 1.1)
  reflections: loadFromStorage('reflections', { lost: '', feel: '', easier: '' }),
  setReflection: (key, value) => {
    const updated = { ...get().reflections, [key]: value }
    set({ reflections: updated })
    saveToStorage('reflections', updated)
  },

  // Watch & Learn reflections (Module 1.2)
  watchReflections: loadFromStorage('watchReflections', { useful: '', reduce: '' }),
  setWatchReflection: (key, value) => {
    const updated = { ...get().watchReflections, [key]: value }
    set({ watchReflections: updated })
    saveToStorage('watchReflections', updated)
  },

  // Quiz (Module 1.3)
  quizAnswers: loadFromStorage('quizAnswers', {}),
  quizScore: loadFromStorage('quizScore', 0),
  quizCompleted: loadFromStorage('quizCompleted', false),
  setQuizAnswer: (qIndex, answer, isCorrect) => {
    const answers = { ...get().quizAnswers, [qIndex]: { answer, isCorrect } }
    const score = Object.values(answers).filter(a => a.isCorrect).length
    set({ quizAnswers: answers, quizScore: score })
    saveToStorage('quizAnswers', answers)
    saveToStorage('quizScore', score)
  },
  setQuizCompleted: () => {
    set({ quizCompleted: true })
    saveToStorage('quizCompleted', true)
  },

  // Team Info (Module 2)
  teamInfo: loadFromStorage('teamInfo', { name: '', members: ['', '', '', ''] }),
  setTeamName: (name) => {
    const updated = { ...get().teamInfo, name }
    set({ teamInfo: updated })
    saveToStorage('teamInfo', updated)
  },
  setTeamMember: (index, name) => {
    const members = [...get().teamInfo.members]
    members[index] = name
    const updated = { ...get().teamInfo, members }
    set({ teamInfo: updated })
    saveToStorage('teamInfo', updated)
  },

  // Robot Data
  robotData: loadFromStorage('robotData', {
    name: '',
    personality: '',
    features: [],
    funElements: [],
    tagline: '',
    description: '',
  }),
  setRobotField: (key, value) => {
    const updated = { ...get().robotData, [key]: value }
    set({ robotData: updated })
    saveToStorage('robotData', updated)
  },
  toggleRobotFeature: (feature) => {
    const features = get().robotData.features.includes(feature)
      ? get().robotData.features.filter(f => f !== feature)
      : [...get().robotData.features, feature]
    const updated = { ...get().robotData, features }
    set({ robotData: updated })
    saveToStorage('robotData', updated)
  },
  toggleFunElement: (element) => {
    const funElements = get().robotData.funElements.includes(element)
      ? get().robotData.funElements.filter(e => e !== element)
      : [...get().robotData.funElements, element]
    const updated = { ...get().robotData, funElements }
    set({ robotData: updated })
    saveToStorage('robotData', updated)
  },

  // Drawing data (base64)
  drawingData: loadFromStorage('drawingData', null),
  setDrawingData: (data) => {
    set({ drawingData: data })
    saveToStorage('drawingData', data)
  },

  // Presentation roleplay
  roleplayText: loadFromStorage('roleplayText', ''),
  setRoleplayText: (text) => {
    set({ roleplayText: text })
    saveToStorage('roleplayText', text)
  },

  // Discussion questions
  questions: loadFromStorage('questions', []),
  addQuestion: (question) => {
    const updated = [...get().questions, question]
    set({ questions: updated })
    saveToStorage('questions', updated)
  },

  // Brownie Points
  browniePoints: loadFromStorage('browniePoints', 0),
  addBrowniePoint: () => {
    const updated = get().browniePoints + 1
    set({ browniePoints: updated })
    saveToStorage('browniePoints', updated)
  },

  // Smart Reminder — packed items checklist
  packedItems: loadFromStorage('packedItems', []),
  togglePackedItem: (id) => {
    const current = get().packedItems
    const updated = current.includes(id) ? current.filter(i => i !== id) : [...current, id]
    set({ packedItems: updated })
    saveToStorage('packedItems', updated)
  },
  clearPackedItems: () => {
    set({ packedItems: [] })
    saveToStorage('packedItems', [])
  },

  // Reset all
  resetAll: () => {
    localStorage.clear()
    set({
      currentStep: 0,
      darkMode: false,
      soundEnabled: true,
      xp: 0,
      quizStreak: 0,
      bestStreak: 0,
      achievements: [],
      reflections: { lost: '', feel: '', easier: '' },
      watchReflections: { useful: '', reduce: '' },
      quizAnswers: {},
      quizScore: 0,
      quizCompleted: false,
      teamInfo: { name: '', members: ['', '', '', ''] },
      robotData: { name: '', personality: '', features: [], funElements: [], tagline: '', description: '' },
      drawingData: null,
      roleplayText: '',
      questions: [],
      browniePoints: 0,
    })
  },
}))

export default useStore
