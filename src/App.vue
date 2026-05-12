<template>
  <div class="game-container crt-effect">
    <GameHeader
      :offlineEarnings="offlineEarnings"
      @toggleSound="toggleSound"
      @claimOffline="handleClaimOffline"
    />

    <main class="game-main">
      <aside class="sidebar-left">
        <ScorePanel />
      </aside>

      <section class="game-area">
        <WoodenFish />
      </section>

      <aside class="sidebar-right">
        <UpgradeShop />
        <AchievementPanel />
      </aside>
    </main>

    <AchievementPopup v-if="isLoaded" :achievement="latestAchievement" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import GameHeader from './components/GameHeader.vue'
import WoodenFish from './components/WoodenFish.vue'
import ScorePanel from './components/ScorePanel.vue'
import UpgradeShop from './components/UpgradeShop.vue'
import AchievementPanel from './components/AchievementPanel.vue'
import AchievementPopup from './components/AchievementPopup.vue'
import { useGameData } from './composables/useGameData'
import { useAudio } from './composables/useAudio'

const {
  loadGame,
  saveGame,
  calculateOfflineEarnings,
  claimOfflineEarnings,
  achievements,
  achievementsConfig
} = useGameData()

const { toggleSound, initAudio, createSound } = useAudio()

const offlineEarnings = ref(0)
const latestAchievement = ref(null)
const isLoaded = ref(false) // 数据是否已加载完成
const initialAchievementsLength = ref(0) // 初始成就数量，用于比较

// 监听成就变化，播放成就音效并显示弹窗（仅在新成就解锁时触发）
watch(() => achievements.value.length, (newLen) => {
  // 只有在数据加载完成后，且成就数量超过初始值时才触发（新解锁成就）
  if (isLoaded.value && newLen > initialAchievementsLength.value) {
    // 找出最新解锁的成就
    const newAchievementId = achievements.value[newLen - 1]
    const achievement = achievementsConfig.find(a => a.id === newAchievementId)
    if (achievement) {
      latestAchievement.value = achievement
      createSound('achievement')

      // 2.5秒后清除
      setTimeout(() => {
        latestAchievement.value = null
      }, 2500)
    }
  }
})

function handleClaimOffline() {
  const earnings = claimOfflineEarnings()
  if (earnings > 0) {
    offlineEarnings.value = 0
  }
}

// 定时保存
let saveInterval

onMounted(() => {
  loadGame()

  // 记录初始成就数量，用于比较
  initialAchievementsLength.value = achievements.value.length

  // 计算离线收益
  offlineEarnings.value = calculateOfflineEarnings()

  // 标记数据加载完成，用于控制成就弹窗逻辑
  isLoaded.value = true

  // 初始化音频（需要用户交互后才能使用）
  document.addEventListener('click', initAudio, { once: true })

  // 每30秒自动保存
  saveInterval = setInterval(() => {
    saveGame()
  }, 30000)

  // 离开页面时保存
  window.addEventListener('beforeunload', saveGame)
})

onUnmounted(() => {
  if (saveInterval) {
    clearInterval(saveInterval)
  }
  window.removeEventListener('beforeunload', saveGame)
  saveGame()
})
</script>

<style scoped>
.game-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-bg, #1a1a2e);
  overflow: hidden;
}

.game-main {
  flex: 1;
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  overflow: hidden;
  align-items: stretch;
}

.sidebar-left, .sidebar-right {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.sidebar-left {
  min-width: clamp(180px, 20vw, 300px);
  flex-shrink: 0;
}

.sidebar-right {
  min-width: clamp(220px, 25vw, 400px);
  flex-shrink: 0;
}

.game-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-width: 0;
}

/* 平板和中等屏幕 */
@media (max-width: 1200px) {
  .game-main {
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }
}

/* 小屏幕 - 移动端布局 */
@media (max-width: 900px) {
  .game-main {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow-y: auto;
    padding: var(--spacing-sm);
    gap: var(--spacing-sm);
  }

  .sidebar-left, .sidebar-right {
    width: 100%;
    max-width: min(100%, 500px);
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-sm);
  }

  .sidebar-left > *, .sidebar-right > * {
    flex: 1;
    min-width: clamp(150px, 40vw, 280px);
    max-width: 400px;
  }

  .game-area {
    min-height: clamp(250px, 40vh, 400px);
    width: 100%;
  }
}

/* 超小屏幕 */
@media (max-width: 480px) {
  .game-main {
    padding: var(--spacing-xs);
  }

  .sidebar-left > *, .sidebar-right > * {
    min-width: 100%;
  }
}

/* 大屏幕优化 */
@media (min-width: 1920px) {
  .game-main {
    gap: calc(var(--spacing-lg) * 2);
    padding: calc(var(--spacing-lg) * 2);
  }

  .sidebar-left {
    min-width: 350px;
  }

  .sidebar-right {
    min-width: 450px;
  }
}
</style>