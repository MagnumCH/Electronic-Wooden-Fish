<template>
  <div class="upgrade-shop pixel-border">
    <h2 class="shop-title">升级商店</h2>

    <div class="upgrade-section">
      <div class="upgrade-item">
        <div class="item-info">
          <span class="item-name">木鱼等级</span>
          <span class="item-level">Lv.{{ fishLevel }}</span>
        </div>
        <button
          class="pixel-btn upgrade-btn"
          :class="{ disabled: merit < fishCost }"
          @click="handleUpgrade('fish')"
        >
          升级 {{ fishCost }} 功德
        </button>
      </div>

      <div class="upgrade-item">
        <div class="item-info">
          <span class="item-name">锤子等级</span>
          <span class="item-level">Lv.{{ hammerLevel }}</span>
        </div>
        <button
          class="pixel-btn upgrade-btn"
          :class="{ disabled: merit < hammerCost }"
          @click="handleUpgrade('hammer')"
        >
          升级 {{ hammerCost }} 功德
        </button>
      </div>
    </div>

    <h3 class="skin-title">皮肤商店</h3>
    <div class="skin-section">
      <div
        v-for="(skin, skinId) in skinsConfig"
        :key="skinId"
        class="skin-item"
        :class="{
          owned: unlockedSkins.includes(skinId),
          active: currentSkin === skinId,
          locked: !unlockedSkins.includes(skinId) && merit < skin.cost
        }"
      >
        <div class="skin-preview" :style="{ background: skin.color }"></div>
        <div class="skin-info">
          <span class="skin-name">{{ skin.name }}</span>
          <span class="skin-cost" v-if="!unlockedSkins.includes(skinId)">
            {{ skin.cost }} 功德
          </span>
          <span class="skin-owned" v-else>已拥有</span>
        </div>
        <button
          v-if="!unlockedSkins.includes(skinId)"
          class="pixel-btn buy-btn"
          :class="{ disabled: merit < skin.cost }"
          @click="handleBuySkin(skinId)"
        >
          购买
        </button>
        <button
          v-else-if="currentSkin !== skinId"
          class="pixel-btn select-btn"
          @click="handleSelectSkin(skinId)"
        >
          装备
        </button>
        <span v-else class="equipped-tag">已装备</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameData } from '../composables/useGameData'
import { useAudio } from '../composables/useAudio'

const {
  merit,
  fishLevel,
  hammerLevel,
  unlockedSkins,
  currentSkin,
  getUpgradeCost,
  upgrade,
  unlockSkin,
  setSkin,
  skinsConfig
} = useGameData()

const { createSound } = useAudio()

const fishCost = computed(() => getUpgradeCost('fish'))
const hammerCost = computed(() => getUpgradeCost('hammer'))

function handleUpgrade(type) {
  if (upgrade(type)) {
    createSound('upgrade')
  } else {
    createSound('click')
  }
}

function handleBuySkin(skinId) {
  if (unlockSkin(skinId)) {
    createSound('skinUnlock')
  } else {
    createSound('click')
  }
}

function handleSelectSkin(skinId) {
  if (setSkin(skinId)) {
    createSound('click')
  }
}
</script>

<style scoped>
.upgrade-shop {
  background: var(--color-bg-light, #16213e);
  padding: var(--spacing-md);
  min-width: clamp(200px, 25vw, 400px);
  max-height: clamp(300px, 50vh, 500px);
  overflow-y: auto;
}

.shop-title, .skin-title {
  font-size: var(--font-size-md);
  color: var(--color-primary, #e94560);
  margin-bottom: var(--spacing-md);
  text-align: center;
  letter-spacing: 2px;
}

.skin-title {
  margin-top: var(--spacing-lg);
  font-size: var(--font-size-sm);
}

.upgrade-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.upgrade-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background: var(--color-secondary, #0f3460);
  border: var(--pixel-size) solid var(--color-white, #eaeaea);
}

.item-info {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
}

.item-name {
  color: var(--color-white, #eaeaea);
}

.item-level {
  color: var(--color-cyan, #22d3ee);
}

.upgrade-btn, .buy-btn, .select-btn {
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
}

.upgrade-btn.disabled, .buy-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.skin-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.skin-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs);
  background: var(--color-secondary, #0f3460);
  border: 2px solid transparent;
}

.skin-item.active {
  border-color: var(--color-gold, #ffd700);
}

.skin-item.locked {
  opacity: 0.6;
}

.skin-preview {
  width: clamp(24px, 4vw, 40px);
  height: clamp(24px, 4vw, 40px);
  border: 2px solid var(--color-dark, #0f0f0f);
}

.skin-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.skin-name {
  font-size: var(--font-size-xs);
  color: var(--color-white, #eaeaea);
}

.skin-cost {
  font-size: var(--font-size-xs);
  color: var(--color-gold, #ffd700);
}

.skin-owned, .equipped-tag {
  font-size: var(--font-size-xs);
  color: var(--color-green, #4ade80);
}

.buy-btn, .select-btn {
  padding: var(--spacing-xs);
}
</style>