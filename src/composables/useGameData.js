import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'electronic-wooden-fish-save'

// 离线收益常量
const MAX_OFFLINE_TIME_MS = 8 * 60 * 60 * 1000
const OFFLINE_EARNINGS_MULTIPLIER = 10
const MAX_OFFLINE_HOURS = 8

// 游戏状态
const merit = ref(0)
const totalMerit = ref(0)
const clickPower = ref(1)
const fishLevel = ref(1)
const hammerLevel = ref(1)
const unlockedSkins = ref(['default'])
const currentSkin = ref('default')
const achievements = ref([])
const lastSaveTime = ref(Date.now())

// 成就检查防重记录
let processedAchievementsInFrame = new Set()

// 升级配置
const upgradeConfig = {
  fish: {
    baseCost: 10,
    growthRate: 1.5,
    powerBonus: 1
  },
  hammer: {
    baseCost: 50,
    growthRate: 1.8,
    powerBonus: 2
  }
}

// 皮肤配置
const skinsConfig = {
  default: { name: '原木鱼', cost: 0, color: '#8B4513' },
  golden: { name: '黄金木鱼', cost: 1000, color: '#FFD700' },
  jade: { name: '翡翠木鱼', cost: 5000, color: '#50C878' },
  crystal: { name: '水晶木鱼', cost: 20000, color: '#E0FFFF' },
  rainbow: { name: '彩虹木鱼', cost: 100000, color: 'linear-gradient' }
}

// 成就配置
const achievementsConfig = [
  { id: 'first_click', name: '初次敲击', desc: '敲击木鱼一次', reward: 1, condition: (s) => s.totalMerit >= 1 },
  { id: 'merit_100', name: '小有所成', desc: '累计获得 100 功德', reward: 10, condition: (s) => s.totalMerit >= 100 },
  { id: 'merit_1000', name: '功德无量', desc: '累计获得 1,000 功德', reward: 50, condition: (s) => s.totalMerit >= 1000 },
  { id: 'merit_10000', name: '功德圆满', desc: '累计获得 10,000 功德', reward: 200, condition: (s) => s.totalMerit >= 10000 },
  { id: 'merit_100000', name: '超凡入圣', desc: '累计获得 100,000 功德', reward: 1000, condition: (s) => s.totalMerit >= 100000 },
  { id: 'fish_lv10', name: '木鱼大师', desc: '木鱼等级达到 10', reward: 100, condition: (s) => s.fishLevel >= 10 },
  { id: 'hammer_lv10', name: '锤子大师', desc: '锤子等级达到 10', reward: 100, condition: (s) => s.hammerLevel >= 10 }
]

// 计算升级费用
function getUpgradeCost(type) {
  const config = upgradeConfig[type]
  const level = type === 'fish' ? fishLevel.value : hammerLevel.value
  return Math.floor(config.baseCost * Math.pow(config.growthRate, level - 1))
}

// 计算每次敲击的功德
function getClickPower() {
  return 1 + (fishLevel.value - 1) * upgradeConfig.fish.powerBonus +
         (hammerLevel.value - 1) * upgradeConfig.hammer.powerBonus
}

// 敲击增加功德
function addMerit() {
  const power = getClickPower()
  merit.value += power
  totalMerit.value += power
  checkAchievements()
}

// 升级
function upgrade(type) {
  const cost = getUpgradeCost(type)
  if (merit.value >= cost) {
    merit.value -= cost
    if (type === 'fish') {
      fishLevel.value++
    } else {
      hammerLevel.value++
    }
    return true
  }
  return false
}

// 检查成就（防止同一帧内重复触发）
function checkAchievements() {
  achievementsConfig.forEach(achievement => {
    if (achievements.value.includes(achievement.id)) return
    if (processedAchievementsInFrame.has(achievement.id)) return

    if (achievement.condition({
      totalMerit: totalMerit.value,
      fishLevel: fishLevel.value,
      hammerLevel: hammerLevel.value
    })) {
      achievements.value.push(achievement.id)
      processedAchievementsInFrame.add(achievement.id)
      merit.value += achievement.reward
      totalMerit.value += achievement.reward
    }
  })

  // 在下一帧清空重试记录
  requestAnimationFrame(() => {
    processedAchievementsInFrame.clear()
  })
}

// 解锁皮肤
function unlockSkin(skinId) {
  const skin = skinsConfig[skinId]
  if (skin && !unlockedSkins.value.includes(skinId) && merit.value >= skin.cost) {
    merit.value -= skin.cost
    unlockedSkins.value.push(skinId)
    return true
  }
  return false
}

// 切换皮肤
function setSkin(skinId) {
  if (unlockedSkins.value.includes(skinId)) {
    currentSkin.value = skinId
    return true
  }
  return false
}

// 计算离线收益
function calculateOfflineEarnings() {
  const now = Date.now()
  const elapsed = now - lastSaveTime.value
  const offlineTime = Math.min(elapsed, MAX_OFFLINE_TIME_MS)
  const hours = offlineTime / (60 * 60 * 1000)
  return Math.floor(hours * getClickPower() * OFFLINE_EARNINGS_MULTIPLIER)
}

// 领取离线收益
function claimOfflineEarnings() {
  const earnings = calculateOfflineEarnings()
  if (earnings > 0) {
    merit.value += earnings
    totalMerit.value += earnings
    lastSaveTime.value = Date.now()
  }
  return earnings
}

// 保存游戏
function saveGame() {
  const saveData = {
    merit: merit.value,
    totalMerit: totalMerit.value,
    fishLevel: fishLevel.value,
    hammerLevel: hammerLevel.value,
    unlockedSkins: unlockedSkins.value,
    currentSkin: currentSkin.value,
    achievements: achievements.value,
    lastSaveTime: Date.now()
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData))
}

// 加载游戏
function loadGame() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const data = JSON.parse(saved)

      // 数据校验，防止篡改或损坏
      merit.value = (typeof data.merit === 'number' && !isNaN(data.merit)) ? data.merit : 0
      totalMerit.value = (typeof data.totalMerit === 'number' && !isNaN(data.totalMerit)) ? data.totalMerit : 0
      fishLevel.value = (typeof data.fishLevel === 'number' && data.fishLevel >= 1) ? data.fishLevel : 1
      hammerLevel.value = (typeof data.hammerLevel === 'number' && data.hammerLevel >= 1) ? data.hammerLevel : 1
      unlockedSkins.value = Array.isArray(data.unlockedSkins) ? data.unlockedSkins : ['default']
      currentSkin.value = (typeof data.currentSkin === 'string' && unlockedSkins.value.includes(data.currentSkin)) ? data.currentSkin : 'default'
      achievements.value = Array.isArray(data.achievements) ? data.achievements : []
      lastSaveTime.value = (typeof data.lastSaveTime === 'number' && data.lastSaveTime > 0) ? data.lastSaveTime : Date.now()
    } catch (e) {
      console.error('Failed to load save data:', e)
    }
  }
}

// 导出 composable
export function useGameData() {
  return {
    // 状态
    merit,
    totalMerit,
    fishLevel,
    hammerLevel,
    unlockedSkins,
    currentSkin,
    achievements,

    // 配置
    upgradeConfig,
    skinsConfig,
    achievementsConfig,

    // 常量
    MAX_OFFLINE_TIME_MS,
    MAX_OFFLINE_HOURS,

    // 方法
    getUpgradeCost,
    getClickPower,
    addMerit,
    upgrade,
    unlockSkin,
    setSkin,
    calculateOfflineEarnings,
    claimOfflineEarnings,
    saveGame,
    loadGame
  }
}