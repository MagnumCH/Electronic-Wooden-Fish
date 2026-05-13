<template>
  <div class="wooden-fish-container" @click="handleClick" @touchstart="handleTouch">
    <div class="fish-group" :style="fishGroupStyle">
      <div class="hammer" :class="{ hitting: isHitting }">
        <div class="hammer-head"></div>
        <div class="hammer-handle"></div>
      </div>
      <div class="fish" :class="{ hitting: isHitting }" :style="fishStyle">
        <div class="fish-body">
          <div class="fish-bell">咚</div>
        </div>
      </div>
    </div>
    <div class="click-effect" v-if="showEffect">
      <span class="merit-pop" :style="popStyle">+{{ clickPower }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameData } from '../composables/useGameData'
import { useAudio } from '../composables/useAudio'

const { currentSkin, fishLevel, getClickPower, addMerit } = useGameData()
const { initAudio, createSound } = useAudio()

const isHitting = ref(false)
const showEffect = ref(false)
const popStyle = ref({})

const clickPower = computed(() => getClickPower())

const skinColors = {
  default: { primary: '#8B4513', secondary: '#A0522D', accent: '#654321' },
  golden: { primary: '#FFD700', secondary: '#FFC700', accent: '#B8860B' },
  jade: { primary: '#50C878', secondary: '#3CB371', accent: '#2E8B57' },
  crystal: { primary: '#E0FFFF', secondary: '#B0E0E6', accent: '#87CEEB' },
  rainbow: { primary: '#ff6b6b', secondary: '#ffd93d', accent: '#6bcb77' }
}

const scale = computed(() => 1 + (fishLevel.value - 1) * 0.08)

const fishGroupStyle = computed(() => ({
  '--group-scale': scale.value
}))

const fishStyle = computed(() => {
  const skin = skinColors[currentSkin.value] || skinColors.default
  return {
    '--fish-primary': skin.primary,
    '--fish-secondary': skin.secondary,
    '--fish-accent': skin.accent
  }
})

function handleClick(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  performHit(x, y)
}

function handleTouch(e) {
  e.preventDefault()
  const rect = e.currentTarget.getBoundingClientRect()
  const touch = e.touches[0]
  const x = touch.clientX - rect.left
  const y = touch.clientY - rect.top
  performHit(x, y)
}

function performHit(x, y) {
  initAudio()
  createSound('hit')

  isHitting.value = true

  addMerit()

  popStyle.value = {
    left: `${x}px`,
    top: `${y}px`
  }
  showEffect.value = true

  setTimeout(() => {
    isHitting.value = false
  }, 150)

  setTimeout(() => {
    showEffect.value = false
  }, 800)
}
</script>

<style scoped>
.wooden-fish-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.wooden-fish-container:active {
  cursor: pointer;
}

.fish-group {
  position: relative;
  transform: scale(var(--group-scale, 1));
  transition: transform 0.2s ease-out;
}

.fish {
  position: relative;
}

.fish.hitting {
  animation: fishHit 0.15s ease-out;
}

@keyframes fishHit {
  0% { transform: translateY(0); }
  50% { transform: translateY(8px); }
  100% { transform: translateY(0); }
}

.fish-body {
  width: clamp(140px, 20vw, 200px);
  height: clamp(84px, 12vw, 120px);
  background: var(--fish-primary, #8B4513);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  border: var(--pixel-size) solid var(--fish-accent, #654321);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    inset calc(var(--pixel-size) * 2) calc(var(--pixel-size) * 2) 0 var(--fish-secondary, #A0522D),
    0 calc(var(--pixel-size) * 4) 0 rgba(0, 0, 0, 0.3);
  position: relative;
}

.fish-body::before {
  content: '';
  position: absolute;
  top: clamp(-18px, -4vw, -30px);
  left: 50%;
  transform: translateX(-50%);
  width: clamp(36px, 6vw, 56px);
  height: clamp(22px, 3.5vw, 36px);
  background: var(--fish-primary, #8B4513);
  border-radius: 30px 30px 0 0;
  border: var(--pixel-size) solid var(--fish-accent, #654321);
  border-bottom: none;
}

.fish-bell {
  font-family: 'Press Start 2P', cursive;
  font-size: var(--font-size-lg);
  color: var(--fish-secondary, #FFF8DC);
  text-shadow: 2px 2px 0 var(--fish-accent, #654321);
}

/* 锤子 - 整体在木鱼右侧，锤头在左上，锤柄在右下 */
.hammer {
  position: absolute;
  top: clamp(-30px, -6vw, -50px);
  left: 50%;
  transform: translateX(200%) rotate(-45deg);
  transform-origin: bottom center;
  transition: transform 0.1s;
  z-index: 10;
}

.hammer.hitting {
  animation: hammerHit 0.15s ease-out;
}

@keyframes hammerHit {
  0% { transform: translateX(200%) rotate(-45deg); }
  50% { transform: translateX(200%) rotate(45deg); }
  100% { transform: translateX(200%) rotate(-45deg); }
}

.hammer-head {
  width: clamp(34px, 5.5vw, 54px);
  height: clamp(38px, 6.5vw, 62px);
  background: linear-gradient(135deg, #888 0%, #555 100%);
  border: 3px solid #333;
  border-radius: 4px;
  margin: 0 auto;
}

.hammer-handle {
  width: clamp(10px, 1.8vw, 16px);
  height: clamp(60px, 11vw, 100px);
  background: linear-gradient(90deg, #8B4513 0%, #654321 50%, #8B4513 100%);
  margin: 0 auto;
  border-radius: 4px;
}

.click-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.merit-pop {
  position: absolute;
  font-family: 'Press Start 2P', cursive;
  font-size: var(--font-size-md);
  color: #ffd700;
  text-shadow:
    2px 2px 0 #ff6b6b,
    -2px -2px 0 #22d3ee;
  animation: meritPop 0.8s ease-out forwards;
}

@keyframes meritPop {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateY(-30px) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) scale(0.8);
  }
}
</style>