<template>
  <Transition name="achievement">
    <div v-if="show" class="achievement-popup">
      <div class="popup-content pixel-border">
        <div class="popup-icon">🏆</div>
        <div class="popup-title">成就解锁</div>
        <div class="popup-name">{{ currentAchievement?.name || '' }}</div>
        <div class="popup-desc">{{ currentAchievement?.desc || '' }}</div>
        <div class="popup-reward">+{{ currentAchievement?.reward || 0 }} 功德</div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  achievement: {
    type: Object,
    default: null
  }
})

const show = ref(false)
const currentAchievement = ref(null)

watch(() => props.achievement, (newAchievement) => {
  if (newAchievement) {
    currentAchievement.value = newAchievement
    show.value = true

    // 2秒后自动隐藏
    setTimeout(() => {
      show.value = false
    }, 2000)
  }
}, { immediate: true })
</script>

<style scoped>
.achievement-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.5);
}

.popup-content {
  background: var(--color-bg-light, #16213e);
  padding: var(--spacing-lg);
  text-align: center;
  min-width: clamp(200px, 30vw, 320px);
  animation: popupPulse 0.5s ease-out;
}

.popup-icon {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
}

.popup-title {
  font-size: var(--font-size-sm);
  color: var(--color-gold, #ffd700);
  margin-bottom: var(--spacing-xs);
  letter-spacing: 2px;
}

.popup-name {
  font-size: var(--font-size-md);
  color: var(--color-white, #eaeaea);
  margin-bottom: var(--spacing-xs);
}

.popup-desc {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: var(--spacing-sm);
}

.popup-reward {
  font-size: var(--font-size-md);
  color: var(--color-green, #4ade80);
  font-weight: bold;
}

/* 入场/退场动画 */
.achievement-enter-active {
  animation: achievementIn 0.3s ease-out;
}

.achievement-leave-active {
  animation: achievementOut 0.3s ease-in;
}

@keyframes achievementIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes achievementOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
}

@keyframes popupPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style>