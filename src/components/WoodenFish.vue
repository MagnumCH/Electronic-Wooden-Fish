<template>
  <div class="wooden-fish-container" @click="handleClick" @touchstart="handleTouch">
    <div class="hammer" :class="{ hitting: isHitting }">
      <div class="hammer-head"></div>
      <div class="hammer-handle"></div>
    </div>
    <div class="fish" :class="{ hitting: isHitting }" :style="fishStyle">
      <div class="fish-body">
        <div class="fish-bell">咚</div>
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

const { merit, totalMerit, currentSkin, fishLevel, getClickPower, addMerit } = useGameData()
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

const fishStyle = computed(() => {
  const skin = skinColors[currentSkin.value] || skinColors.default
  const scale = 1 + (fishLevel.value - 1) * 0.05
  return {
    '--fish-primary': skin.primary,
    '--fish-secondary': skin.secondary,
    '--fish-accent': skin.accent,
    '--fish-scale': scale
  }
})

function handleClick(e) {
  performHit(e.clientX, e.clientY)
}

function handleTouch(e) {
  e.preventDefault()
  const touch = e.touches[0]
  performHit(touch.clientX, touch.clientY)
}

function performHit(x, y) {
  initAudio()
  createSound('hit')

  isHitting.value = true
  setTimeout(() => {
    isHitting.value = false
  }, 150)

  addMerit()

  // 显示弹出效果
  showEffect.value = true
  const offsetX = (Math.random() - 0.5) * 60
  popStyle.value = {
    left: `calc(50% + ${offsetX}px)`,
    top: '30%'
  }

  setTimeout(() => {
    showEffect.value = false
  }, 800)
}
</script>

<style scoped>
.wooden-fish-container {
  position: relative;
  display: flex;
  flex-direction: column;
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

/* 木鱼本体 */
.fish {
  position: relative;
  transform: scale(var(--fish-scale, 1));
  transition: transform 0.1s;
}

.fish.hitting {
  animation: fishHit 0.15s ease-out;
}

@keyframes fishHit {
  0% { transform: scale(var(--fish-scale, 1)); }
  50% { transform: scale(var(--fish-scale, 1)) translateY(8px); }
  100% { transform: scale(var(--fish-scale, 1)); }
}

.fish-body {
  width: var(--fish-width);
  height: var(--fish-height);
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
  top: clamp(-20px, -5vw, -40px);
  left: 50%;
  transform: translateX(-50%);
  width: clamp(40px, 8vw, 80px);
  height: clamp(25px, 5vw, 50px);
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

/* 锤子 */
.hammer {
  position: absolute;
  top: clamp(5%, 8vw, 15%);
  right: clamp(15%, 20vw, 30%);
  transform-origin: bottom center;
  transform: rotate(-30deg);
  transition: transform 0.1s;
  z-index: 10;
}

.hammer.hitting {
  animation: hammerHit 0.15s ease-out;
}

@keyframes hammerHit {
  0% { transform: rotate(-30deg); }
  50% { transform: rotate(20deg); }
  100% { transform: rotate(-30deg); }
}

.hammer-head {
  width: clamp(30px, 5vw, 50px);
  height: clamp(35px, 6vw, 60px);
  background: linear-gradient(135deg, #888 0%, #555 100%);
  border: 3px solid #333;
  border-radius: 4px;
}

.hammer-handle {
  width: clamp(10px, 2vw, 18px);
  height: clamp(50px, 10vw, 100px);
  background: linear-gradient(90deg, #8B4513 0%, #654321 50%, #8B4513 100%);
  margin: 0 auto;
  border-radius: 0 0 4px 4px;
}

/* 点击效果 */
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