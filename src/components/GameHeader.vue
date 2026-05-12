<template>
  <header class="game-header">
    <h1 class="game-title">电子木鱼</h1>
    <div class="header-controls">
      <button class="pixel-btn" @click="$emit('toggleSound')">
        {{ soundEnabled ? '🔊' : '🔇' }}
      </button>
      <button class="pixel-btn" @click="$emit('claimOffline')" v-if="offlineEarnings > 0">
        离线收益 {{ offlineEarnings }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { useAudio } from '../composables/useAudio'

defineProps({
  offlineEarnings: {
    type: Number,
    default: 0
  }
})

defineEmits(['toggleSound', 'claimOffline'])

const { soundEnabled } = useAudio()
</script>

<style scoped>
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg-light, #16213e);
  border-bottom: var(--pixel-size) solid var(--color-secondary, #0f3460);
}

.game-title {
  font-size: var(--font-size-title);
  color: var(--color-primary, #e94560);
  letter-spacing: 4px;
  text-shadow: 2px 2px 0 var(--color-dark, #0f0f0f);
}

.header-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.header-controls .pixel-btn {
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
}
</style>