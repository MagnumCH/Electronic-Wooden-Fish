<template>
  <div class="achievement-panel pixel-border">
    <h2 class="panel-title">成就列表</h2>
    <div class="achievement-list">
      <div
        v-for="achievement in achievementsConfig"
        :key="achievement.id"
        class="achievement-item"
        :class="{ unlocked: achievements.includes(achievement.id) }"
      >
        <div class="achievement-icon">
          <span v-if="achievements.includes(achievement.id)">★</span>
          <span v-else>☆</span>
        </div>
        <div class="achievement-info">
          <span class="achievement-name">{{ achievement.name }}</span>
          <span class="achievement-desc">{{ achievement.desc }}</span>
        </div>
        <div class="achievement-reward">
          +{{ achievement.reward }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameData } from '../composables/useGameData'

const { achievements, achievementsConfig } = useGameData()
</script>

<style scoped>
.achievement-panel {
  background: var(--color-bg-light, #16213e);
  padding: var(--spacing-md);
  min-width: clamp(180px, 22vw, 320px);
  max-height: clamp(250px, 40vh, 450px);
  overflow-y: auto;
}

.panel-title {
  font-size: var(--font-size-md);
  color: var(--color-purple, #a855f7);
  margin-bottom: var(--spacing-md);
  text-align: center;
  letter-spacing: 2px;
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  background: var(--color-secondary, #0f3460);
  opacity: 0.5;
  transition: opacity 0.3s;
}

.achievement-item.unlocked {
  opacity: 1;
  border-left: var(--pixel-size) solid var(--color-gold, #ffd700);
}

.achievement-icon {
  font-size: var(--font-size-lg);
  color: var(--color-gold, #ffd700);
}

.achievement-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.achievement-name {
  font-size: var(--font-size-sm);
  color: var(--color-white, #eaeaea);
}

.achievement-desc {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.6);
}

.achievement-reward {
  font-size: var(--font-size-sm);
  color: var(--color-green, #4ade80);
}
</style>