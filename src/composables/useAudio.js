import { ref } from 'vue'

const audioContext = ref(null)
const soundEnabled = ref(true)

// 初始化音频上下文
function initAudio() {
  if (!audioContext.value) {
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext.value
}

// 创建 8-bit 风格的音效
function createSound(type) {
  const ctx = initAudio()
  if (!ctx || !soundEnabled.value) return

  // 恢复上下文（如果被暂停）
  if (ctx.state === 'suspended') {
    ctx.resume()
  }

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  switch (type) {
    case 'hit':
      // 敲击木鱼的声音 - 低沉有力
      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(150, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1)
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.2)
      break

    case 'upgrade':
      // 升级音效 - 上升音阶
      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(300, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15)
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.2)
      break

    case 'achievement':
      // 成就解锁音效 - 欢快的三连音
      playNotes([523, 659, 784], 0.1) // C5, E5, G5
      break

    case 'skinUnlock':
      // 皮肤解锁音效 - 闪亮的上升
      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(400, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3)
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.4)
      break

    case 'click':
      // 按钮点击音效
      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(200, ctx.currentTime)
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.05)
      break
  }
}

// 播放连续音符
function playNotes(frequencies, duration) {
  const ctx = initAudio()
  if (!ctx || !soundEnabled.value) return

  if (ctx.state === 'suspended') {
    ctx.resume()
  }

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