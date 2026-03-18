// Web Audio API sound effects - no external files needed!
let audioCtx = null
let audioReady = false
let unlockListenersAttached = false

function canUseAudio() {
  return typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)
}

function removeUnlockListeners() {
  if (!unlockListenersAttached || typeof window === 'undefined') return

  window.removeEventListener('pointerdown', unlockAudio, true)
  window.removeEventListener('keydown', unlockAudio, true)
  window.removeEventListener('touchstart', unlockAudio, true)
  unlockListenersAttached = false
}

async function unlockAudio() {
  if (!canUseAudio()) return

  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume()
    }

    audioReady = audioCtx.state === 'running'
    if (audioReady) removeUnlockListeners()
  } catch {
    audioReady = false
  }
}

function ensureUnlockListeners() {
  if (!canUseAudio() || unlockListenersAttached) return

  window.addEventListener('pointerdown', unlockAudio, true)
  window.addEventListener('keydown', unlockAudio, true)
  window.addEventListener('touchstart', unlockAudio, true)
  unlockListenersAttached = true
}

function getCtx() {
  ensureUnlockListeners()
  if (!audioCtx || !audioReady || audioCtx.state !== 'running') return null
  return audioCtx
}

function playTone(frequency, duration, type = 'sine', volume = 0.15) {
  try {
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch { /* ignore audio errors */ }
}

export function playClick() {
  playTone(800, 0.08, 'square', 0.08)
}

export function playCorrect() {
  playTone(523, 0.12, 'sine', 0.12)
  setTimeout(() => playTone(659, 0.12, 'sine', 0.12), 100)
  setTimeout(() => playTone(784, 0.2, 'sine', 0.15), 200)
}

export function playWrong() {
  playTone(300, 0.15, 'sawtooth', 0.1)
  setTimeout(() => playTone(200, 0.25, 'sawtooth', 0.08), 150)
}

export function playLevelUp() {
  const notes = [523, 659, 784, 1047]
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.12), i * 120)
  })
}

export function playAchievement() {
  playTone(880, 0.1, 'sine', 0.1)
  setTimeout(() => playTone(1108, 0.1, 'sine', 0.1), 80)
  setTimeout(() => playTone(1318, 0.15, 'sine', 0.12), 160)
  setTimeout(() => playTone(1760, 0.3, 'sine', 0.15), 250)
}

export function playWhoosh() {
  try {
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.2)
  } catch { /* ignore */ }
}

export function playStreak() {
  playTone(880, 0.08, 'square', 0.08)
  setTimeout(() => playTone(1100, 0.08, 'square', 0.08), 60)
  setTimeout(() => playTone(1320, 0.12, 'square', 0.1), 120)
}

export function playPop() {
  playTone(600, 0.06, 'sine', 0.1)
}

export function playType() {
  playTone(1200 + Math.random() * 400, 0.03, 'square', 0.03)
}

export function playSuccess() {
  playTone(660, 0.1, 'sine', 0.1)
  setTimeout(() => playTone(880, 0.2, 'sine', 0.15), 100)
}

ensureUnlockListeners()
