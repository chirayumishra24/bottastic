import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store'
import { playCorrect, playWrong, playStreak, playClick } from '../utils/sounds'
import { triggerToast } from './AchievementToast'

const questions = [
  {
    question: 'What is the main job of the Lost & Found Robot Buddy?',
    options: [
      { label: 'A', text: 'Doing homework for students' },
      { label: 'B', text: 'Finding and returning lost items' },
      { label: 'C', text: 'Teaching math lessons' },
      { label: 'D', text: 'Cleaning classrooms' },
    ],
    correct: 'B',
    explanation: 'The robot\'s main job is to find and return lost items to students!',
  },
  {
    question: 'Which feature would help the robot identify the owner of a lost water bottle?',
    options: [
      { label: 'A', text: 'Item scanning system' },
      { label: 'B', text: 'Dance mode' },
      { label: 'C', text: 'Loud music player' },
      { label: 'D', text: 'Color changing lights' },
    ],
    correct: 'A',
    explanation: 'An item scanning system can read labels or tags to identify who owns the bottle!',
  },
  {
    question: 'If the robot sends "Hey! Your lunch box is waiting near the library!" — what feature is it using?',
    options: [
      { label: 'A', text: 'Game mode' },
      { label: 'B', text: 'Reminder alert system' },
      { label: 'C', text: 'Homework solver' },
      { label: 'D', text: 'Weather predictor' },
    ],
    correct: 'B',
    explanation: 'The robot is using its reminder alert system to notify the student!',
  },
  {
    question: 'Which personality would make the robot most fun for students?',
    options: [
      { label: 'A', text: 'Silent robot' },
      { label: 'B', text: 'Funny and friendly robot' },
      { label: 'C', text: 'Angry robot' },
      { label: 'D', text: 'Sleeping robot' },
    ],
    correct: 'B',
    explanation: 'A funny and friendly personality makes students WANT to use the robot!',
  },
  {
    question: 'What is the first step when designing a helpful robot?',
    options: [
      { label: 'A', text: 'Give it a name' },
      { label: 'B', text: 'Identify the problem it will solve' },
      { label: 'C', text: 'Draw the robot' },
      { label: 'D', text: 'Present the robot' },
    ],
    correct: 'B',
    explanation: 'You must first identify the problem before you can design a solution!',
  },
  {
    question: 'Why is teamwork important in the Robot Innovation Lab?',
    options: [
      { label: 'A', text: 'To finish work faster' },
      { label: 'B', text: 'To share ideas and creativity' },
      { label: 'C', text: 'To make drawings colorful' },
      { label: 'D', text: 'To collect more paper' },
    ],
    correct: 'B',
    explanation: 'Teamwork lets everyone share ideas and be creative together!',
  },
  {
    question: 'Which of these would be the most creative robot feature?',
    options: [
      { label: 'A', text: 'Robot that plays hide and seek with items' },
      { label: 'B', text: 'Robot that breaks pencils' },
      { label: 'C', text: 'Robot that hides bags' },
      { label: 'D', text: 'Robot that throws notebooks' },
    ],
    correct: 'A',
    explanation: 'Playing hide and seek with items is creative AND helpful — fun way to return stuff!',
  },
  {
    question: 'What is a product pitch?',
    options: [
      { label: 'A', text: 'A robot dance performance' },
      { label: 'B', text: 'A short explanation of why your invention is useful' },
      { label: 'C', text: 'A robot drawing competition' },
      { label: 'D', text: 'A robot repair activity' },
    ],
    correct: 'B',
    explanation: 'A product pitch is when you explain why your invention is awesome and useful!',
  },
  {
    question: 'If a robot says "Alert! Someone forgot their red bottle near the playground!" — what ability is it showing?',
    options: [
      { label: 'A', text: 'Object detection' },
      { label: 'B', text: 'Singing' },
      { label: 'C', text: 'Jumping' },
      { label: 'D', text: 'Sleeping' },
    ],
    correct: 'A',
    explanation: 'The robot is using object detection to spot and describe the lost item!',
  },
  {
    question: '🧠 Mind-Twister: If 5 students lose their items every day and the robot finds 4 items daily, how many items might still remain lost after one day?',
    options: [
      { label: 'A', text: '0' },
      { label: 'B', text: '1' },
      { label: 'C', text: '4' },
      { label: 'D', text: '5' },
    ],
    correct: 'B',
    explanation: '5 lost − 4 found = 1 item still lost. Quick maths! 🧮',
  },
]

const bonusRiddle = {
  riddle: 'I never get tired,\nI search day and night.\nIf you lose your bottle,\nI help set things right.',
  answer: 'The Lost & Found Robot Buddy 🤖',
}

const encouragements = {
  correct: [
    "BOOM! You're on FIRE! 🔥",
    "Galaxy brain activated! 🧠✨",
    "Nailed it like a pro! 💪",
    "That's what I'm talking about! 🎯",
    "You're UNSTOPPABLE! 🚀",
  ],
  wrong: [
    "Oops! But hey, now you know! 📚",
    "Almost! You'll get the next one! 💪",
    "Learning is all about trying! 🌟",
    "Every mistake makes you smarter! 🧠",
  ],
  streak: [
    "🔥 STREAK x{n}! You're on fire!",
    "⚡ COMBO x{n}! Unstoppable!",
    "💫 x{n} CHAIN! Keep it going!",
  ],
}

const TIMER_SECONDS = 25

export default function Quiz() {
  const {
    quizAnswers, quizScore, quizCompleted, setQuizAnswer, setQuizCompleted,
    setCurrentStep, darkMode, soundEnabled, addXP, quizStreak, setQuizStreak,
    unlockAchievement
  } = useStore()
  const [currentQ, setCurrentQ] = useState(0)
  const [timer, setTimer] = useState(TIMER_SECONDS)
  const [showExplanation, setShowExplanation] = useState(false)
  const [comboText, setComboText] = useState('')
  const [encouragement, setEncouragement] = useState('')
  const timerRef = useRef(null)
  const [timerActive, setTimerActive] = useState(true)

  // Timer countdown
  useEffect(() => {
    if (quizCompleted || quizAnswers[currentQ]) {
      setTimerActive(false)
      return
    }
    setTimer(TIMER_SECONDS)
    setTimerActive(true)

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [currentQ, quizCompleted])

  const handleAnswer = (qIndex, label) => {
    if (quizAnswers[qIndex]) return
    clearInterval(timerRef.current)
    setTimerActive(false)

    const isTimeout = label === 'TIMEOUT'
    const isCorrect = !isTimeout && label === questions[qIndex].correct

    setQuizAnswer(qIndex, isTimeout ? 'TIMEOUT' : label, isCorrect)

    if (isCorrect) {
      if (soundEnabled) playCorrect()
      const newStreak = quizStreak + 1
      setQuizStreak(newStreak)

      const streakBonus = Math.min(newStreak - 1, 3) * 2
      const xpGained = 5 + streakBonus
      const leveled = addXP(xpGained)

      if (newStreak >= 2) {
        if (soundEnabled) playStreak()
        const streakMsg = encouragements.streak[Math.floor(Math.random() * encouragements.streak.length)]
        setComboText(streakMsg.replace('{n}', newStreak))
        setTimeout(() => setComboText(''), 2000)
      }

      setEncouragement(encouragements.correct[Math.floor(Math.random() * encouragements.correct.length)])

      if (newStreak >= 3 && unlockAchievement('streak-3')) {
        triggerToast('Hot Streak! 🔥', '3 correct answers in a row!', '🔥')
      }
      if (leveled) {
        triggerToast('LEVEL UP! 🎉', 'You reached a new rank!', '⬆️')
      }
    } else {
      if (soundEnabled && !isTimeout) playWrong()
      setQuizStreak(0)
      setEncouragement(encouragements.wrong[Math.floor(Math.random() * encouragements.wrong.length)])
    }

    setShowExplanation(true)

    if (qIndex === questions.length - 1) {
      setTimeout(() => {
        setQuizCompleted()
        if (unlockAchievement('quiz-complete')) {
          triggerToast('Quiz Master! 🧠', 'Completed the knowledge test!', '🧠')
        }
      }, 2500)
    } else {
      setTimeout(() => {
        setShowExplanation(false)
        setEncouragement('')
        setCurrentQ(qIndex + 1)
      }, 2500)
    }
  }

  const q = questions[currentQ]
  const answered = quizAnswers[currentQ]

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <span className="text-5xl">🧠</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">
          <span className={`bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent ${darkMode ? 'neon-text' : ''}`}>
            System Test: Quiz
          </span>
        </h2>
        <p className={`mt-2 font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          [Module 1.3] – Knowledge Verification
        </p>
      </motion.div>

      {/* Streak & Score Banner */}
      <div className="flex justify-center gap-4 mb-4">
        {quizStreak >= 2 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="streak-fire px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold font-mono shadow-lg"
          >
            🔥 STREAK x{quizStreak}
          </motion.div>
        )}
        <div className={`px-4 py-1.5 rounded-full text-sm font-mono font-bold ${
          darkMode ? 'bg-gray-800 text-cyan-400 border border-cyan-500/30' : 'bg-cyan-100 text-cyan-700'
        }`}>
          Score: {quizScore}/{questions.length}
        </div>
      </div>

      {/* Progress */}
      <div className="flex justify-center gap-1.5 mb-6 flex-wrap">
        {questions.map((_, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.2 }}
            className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs font-mono transition-all cursor-pointer ${
              i === currentQ
                ? 'bg-cyan-500 text-black scale-110 shadow-lg neon-glow-cyan'
                : quizAnswers[i]?.isCorrect
                ? 'bg-emerald-500 text-black'
                : quizAnswers[i]
                ? 'bg-red-500 text-white'
                : darkMode
                ? 'bg-gray-800 text-gray-500 border border-gray-700'
                : 'bg-gray-200 text-gray-500'
            }`}
            onClick={() => { if (soundEnabled) playClick(); setCurrentQ(i) }}
          >
            {quizAnswers[i] ? (quizAnswers[i].isCorrect ? '✓' : '✗') : i + 1}
          </motion.div>
        ))}
      </div>

      {/* Combo text overlay */}
      <AnimatePresence>
        {comboText && (
          <motion.div
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center mb-4"
          >
            <span className="combo-pop inline-block text-2xl font-extrabold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              {comboText}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {!quizCompleted ? (
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-lg relative overflow-hidden ${darkMode ? 'robo-card neon-glow' : 'robo-card-light shadow-lg'}`}
        >
          {/* Timer bar */}
          {timerActive && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>⏱️ Time</span>
                <span className={`text-sm font-bold font-mono ${timer <= 5 ? 'text-red-500 timer-danger rounded-full px-2' : darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  {timer}s
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <motion.div
                  className={`h-full rounded-full transition-colors duration-300 ${timer <= 5 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-cyan-400 to-emerald-400'}`}
                  animate={{ width: `${(timer / TIMER_SECONDS) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          <h3 className="text-lg font-bold mb-6">
            Q{currentQ + 1}: {q.question}
          </h3>
          <div className="space-y-3">
            {q.options.map((opt) => {
              let btnClass = darkMode
                ? 'bg-gray-900/50 hover:bg-gray-800 border-cyan-500/20 hover:border-cyan-500/50'
                : 'bg-gray-50 hover:bg-cyan-50 border-gray-200 hover:border-cyan-300'

              if (answered) {
                if (opt.label === q.correct) {
                  btnClass = 'bg-emerald-500/20 border-emerald-500 dark:bg-emerald-900/30 dark:border-emerald-500'
                } else if (opt.label === answered.answer && !answered.isCorrect) {
                  btnClass = 'bg-red-500/20 border-red-500 dark:bg-red-900/30 dark:border-red-500'
                }
              }

              return (
                <motion.button
                  key={opt.label}
                  onClick={() => { if (soundEnabled) playClick(); handleAnswer(currentQ, opt.label) }}
                  disabled={!!answered}
                  whileHover={!answered ? { scale: 1.02, x: 5 } : {}}
                  whileTap={!answered ? { scale: 0.98 } : {}}
                  animate={
                    answered && opt.label === answered.answer
                      ? answered.isCorrect
                        ? { scale: [1, 1.05, 1] }
                        : { x: [0, -5, 5, -5, 5, 0] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${btnClass} ${
                    answered ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm font-mono transition-all ${
                    answered && opt.label === q.correct
                      ? 'bg-emerald-500 text-white'
                      : darkMode ? 'bg-gray-800 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                  }`}>
                    {opt.label}
                  </span>
                  <span className="font-medium text-sm">{opt.text}</span>
                  {answered && opt.label === q.correct && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto text-emerald-500 text-xl">✓</motion.span>
                  )}
                  {answered && opt.label === answered.answer && !answered.isCorrect && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto text-red-500 text-xl">✗</motion.span>
                  )}
                </motion.button>
              )
            })}
          </div>

          {answered && (
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 space-y-2"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`p-3 rounded-lg text-center font-bold font-mono ${
                      answered.isCorrect
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {encouragement}
                    {answered.isCorrect && (
                      <span className="ml-2 text-xs opacity-75">+{5 + Math.min(Math.max(quizStreak - 1, 0), 3) * 2} XP</span>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`p-3 rounded-lg text-sm ${darkMode ? 'bg-gray-800/50 text-gray-300' : 'bg-blue-50 text-blue-800'}`}
                  >
                    💡 {q.explanation}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-8 rounded-lg text-center ${darkMode ? 'robo-card neon-glow' : 'robo-card-light shadow-lg'}`}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: 2 }}
            className="text-7xl mb-4"
          >
            {quizScore === questions.length ? '🏆' : quizScore >= 7 ? '🌟' : quizScore >= 4 ? '👏' : '💪'}
          </motion.div>
          <h3 className={`text-3xl font-bold mb-2 ${quizScore === questions.length ? 'rainbow-glow' : ''}`}>
            {quizScore === questions.length ? 'PERFECT SCORE!' : quizScore >= 7 ? 'Amazing Job!' : 'Test Complete!'}
          </h3>
          <p className={`text-lg mb-2 font-mono ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Score: <span className="font-bold text-cyan-500">{quizScore}/{questions.length}</span>
          </p>
          {useStore.getState().bestStreak > 0 && (
            <p className={`text-sm mb-4 font-mono ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              🔥 Best streak: {useStore.getState().bestStreak}
            </p>
          )}
          <div className="flex justify-center gap-1.5 flex-wrap mb-4">
            {[...Array(Math.min(quizScore, 10))].map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
                className="text-2xl"
              >
                ⭐
              </motion.span>
            ))}
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {quizScore === questions.length
              ? "PERFECT! You're a certified Robot Genius! 🚀"
              : quizScore >= 7
              ? "Awesome work! You really know your robots! 🤖"
              : "Great effort! Every answer teaches you something new! Let's go build! 🤖"}
          </p>

          {/* Bonus Riddle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className={`mt-6 p-5 rounded-lg text-left ${darkMode ? 'bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30' : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'}`}
          >
            <h4 className="text-lg font-bold mb-2 text-center">🎁 Bonus Riddle!</h4>
            <p className={`text-sm whitespace-pre-line italic text-center mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
              {bonusRiddle.riddle}
            </p>
            <p className="text-center font-bold text-sm">
              Answer: <span className="text-cyan-500">{bonusRiddle.answer}</span>
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(2)}
          className={`px-6 py-3 rounded-lg font-medium font-mono transition-colors ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          ◀ Back
        </button>
        <button
          onClick={() => setCurrentStep(4)}
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
