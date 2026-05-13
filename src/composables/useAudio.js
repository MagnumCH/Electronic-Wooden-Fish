import { ref } from 'vue'

const audioContext = ref(null)
const soundEnabled = ref(true)

// 初始化音频上下文
function initAudio() {
  if (!audioContext.value) {
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioContext.value.state === 'suspended') {
    audioContext.value.resume()
  }
  return audioContext.value
}

// 创建 8-bit 风格的音效
function createSound(type) {
  const ctx = initAudio()
  if (!ctx || !soundEnabled.value) return

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  let duration = 0.2

  switch (type) {
    case 'hit':
      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(150, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1)
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
      duration = 0.2
      break

    case 'upgrade':
      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(300, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15)
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
      duration = 0.2
      break

    case 'achievement':
      playNotes([523, 659, 784], 0.1)
      return

    case 'skinUnlock':
      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(400, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3)
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
      duration = 0.4
      break

    case 'click':
      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(200, ctx.currentTime)
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
      duration = 0.05
      break
  }

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + duration)

  // 播放完成后清理
  setTimeout(() => {
    try {
      oscillator.disconnect()
      gainNode.disconnect()
    } catch (e) {}
  }, (duration + 0.1) * 1000)
}

// 播放连续音符
function playNotes(frequencies, duration) {
  const ctx = initAudio()
  if (!ctx || !soundEnabled.value) return

  frequencies.forEach((freq, index) => {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime)

    const startTime = ctx.currentTime + index * duration
    gainNode.gain.setValueAtTime(0.2, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

    oscillator.start(startTime)
    oscillator.stop(startTime + duration)

    // 播放完成后清理
    setTimeout(() => {
      try {
        oscillator.disconnect()
        gainNode.disconnect()
      } catch (e) {}
    }, (duration + 0.1) * 1000)
  })
}

// 切换音效开关
function toggleSound() {
  soundEnabled.value = !soundEnabled.value
}

export function useAudio() {
  return {
    soundEnabled,
    initAudio,
    createSound,
    toggleSound,
    playNotes
  }
}