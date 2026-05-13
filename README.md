# 电子木鱼 - Electronic Wooden Fish

<p align="center">
  <img src="icon.png" width="120" alt="电子木鱼 Logo">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5-green.svg">
  <img src="https://img.shields.io/badge/Vite-5.0-blue.svg">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg">
</p>

> 一款复古像素风格的电子木鱼解压小游戏，让你在敲击中获得内心的平静。

[English](./README_EN.md) | 简体中文

---

## 🎮 游戏介绍

电子木鱼是一款基于 Web 的解压小游戏，融合了佛教禅意元素和复古8-bit像素风格。玩家通过敲击木鱼累积功德，升级装备，收集皮肤，体验怀旧的FC游戏氛围。

### ✨ 特色功能

- 🔔 **敲击木鱼** - 点击即敲，聆听复古8-bit音效
- 📈 **升级系统** - 木鱼等级、锤子等级双重提升
- 🎨 **皮肤收集** - 5种精美像素风格木鱼皮肤
- 🏆 **成就系统** - 7个成就里程碑等你解锁
- 💾 **离线收益** - 放置游戏也能累积功德
- 📱 **响应式设计** - 完美适配各种屏幕尺寸

---

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| Vue 3 | 渐进式 JavaScript 框架 |
| Vite 5 | 下一代前端构建工具 |
| CSS Variables | 响应式像素风格样式 |
| Web Audio API | 8-bit 复古音效 |
| localStorage | 数据持久化存储 |

---

## 📁 项目结构

```
Electronic-Wooden-Fish/
├── public/
│   └── fish.svg              # 木鱼图标
├── src/
│   ├── components/           # Vue 组件
│   │   ├── WoodenFish.vue    # 木鱼主组件
│   │   ├── ScorePanel.vue    # 功德面板
│   │   ├── UpgradeShop.vue   # 升级商店
│   │   ├── AchievementPanel.vue # 成就面板
│   │   └── GameHeader.vue    # 游戏头部
│   ├── composables/          # 组合式函数
│   │   ├── useGameData.js    # 游戏数据管理
│   │   └── useAudio.js       # 音效系统
│   ├── App.vue               # 根组件
│   ├── main.js               # 入口文件
│   └── style.css             # 全局样式
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- npm >= 8

### 安装运行

```bash
# 克隆项目
git clone https://github.com/MagnumCH/Electronic-Wooden-Fish.git

# 进入目录
cd Electronic-Wooden-Fish

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173 开始敲木鱼！

### 构建生产版本

```bash
npm run build
```

产物将输出到 `dist/` 目录。

---

## 🎯 游戏玩法

### 核心循环

1. **敲击木鱼** → 累积功德值
2. **升级装备** → 提升每次敲击收益
3. **解锁皮肤** → 收集更多木鱼外观
4. **达成成就** → 领取成就奖励

### 升级公式

```
升级费用 = 基础费用 × 增长率^(当前等级-1)
每次敲击收益 = 1 + (木鱼等级-1)×1 + (锤子等级-1)×2
```

### 皮肤列表

| 皮肤 | 价格 | 描述 |
|------|------|------|
| 原木鱼 | 免费 | 默认皮肤 |
| 黄金木鱼 | 1,000 功德 | 金色荣耀 |
| 翡翠木鱼 | 5,000 功德 | 翠绿如玉 |
| 水晶木鱼 | 20,000 功德 | 晶莹剔透 |
| 彩虹木鱼 | 100,000 功德 | 流光溢彩 |

---

## 🎨 视觉风格

- **8-bit 像素艺术** - 致敬经典FC游戏
- **NES 配色方案** - 低饱和度高对比度
- **像素字体** - Press Start 2P
- **CRT 扫描线** - 复古CRT显示器效果

---

## 📜 成就列表

| 成就 | 描述 | 奖励 |
|------|------|------|
| 初次敲击 | 敲击木鱼一次 | +1 |
| 小有所成 | 累计获得100功德 | +10 |
| 功德无量 | 累计获得1,000功德 | +50 |
| 功德圆满 | 累计获得10,000功德 | +200 |
| 超凡入圣 | 累计获得100,000功德 | +1000 |
| 木鱼大师 | 木鱼等级达到10 | +100 |
| 锤子大师 | 锤子等级达到10 | +100 |

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

<p align="center">
  敲击木鱼 · 功德无量 · 内心平静
</p>