<template>
  <div class="score-panel pixel-border">
    <div class="merit-display">
      <div class="merit-label">功德</div>
      <div class="merit-value" :class="{ highlight: isHighlight }">
        {{ formatNumber(merit) }}
      </div>
    </div>
    <div class="total-display">
      <span class="total-label">累计:</span>
      <span class="total-value">{{ formatNumber(totalMerit) }}</span>
    </div>
    <div class="power-display">
      <span class="power-label">每次敲击:</span>
      <span class="power-value">+{{ clickPower }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useGameData } from '../composables/useGameData'

const { merit, totalMerit, getClickPower } = useGameData()

const isHighlight = ref(false)

const clickPower = computed(() => getClickPower())

watch(merit, (newVal, oldVal) => {
  if (newVal > oldVal) {
    isHighlight.value = true
    setTimeout(() => {
      isHighlight.value = false
    }, 200)
  }
})

function formatNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return Math.floor(num).toString()
}
</script>

<style scoped>
.score-panel {
  background: var(--color-bg-light, #16213e);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-width: clamp(160px, 20vw, 280px);
}

.merit-display {
  text-align: center;
}

.merit-label {
  font-size: var(--font-size-sm);
  color: var(--color-cyan, #22d3ee);
  margin-bottom: var(--spacing-xs);
  letter-spacing: 2px;
}

.merit-value {
  font-size: var(--font-size-xl);
  color: var(--color-gold, #ffd700);
  text-shadow: 2px 2px 0 var(--color-dark, #0f0f0f);
  transition: transform 0.1s, color 0.1s;
}

.merit-value.highlight {
  transform: scale(1.1);
  color: #fff;
}

.total-display, .power-display {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) 0;
  border-top: 2px dashed rgba(255, 255, 255, 0.1);
}

.total-label, .power-label {
  color: rgba(255, 255, 255, 0.6);
}

.total-value {
  color: var(--color-white, #eaeaea);
}

.power-value {
  color: var(--color-green, #4ade80);
}
</style>