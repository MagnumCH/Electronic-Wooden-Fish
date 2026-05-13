# Electron 打包指南

本文档记录将电子木鱼项目打包为 Windows 可执行文件（exe）的完整流程。

## 环境要求

- Node.js >= 16（建议 v18+）
- npm >= 8
- Windows 10/11

## 依赖版本（已验证可用）

```json
{
  "electron": "^27.3.0",
  "electron-packager": "^17.1.2",
  "electron-builder": "^24.13.3"
}
```

> ⚠️ **注意**：Electron 33 版本存在 DLL 依赖问题，会导致 exe 启动报错。建议使用 Electron 27。

## 完整打包流程

### 第一步：项目配置检查

#### 1.1 设置 CommonJS 模式

Electron 主进程不支持 ES Module，需要在 `package.json` 中设置：

```json
{
  "type": "commonjs"
}
```

> ⚠️ **易错点**：如果 `type` 设为 `module`，打包后会报错：`require() of ES Module not supported`

#### 1.2 配置 Vite 基础路径

为支持 Electron 本地加载，需要将 `base` 设为相对路径：

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
```

> ⚠️ **易错点**：路径必须用 `./` 而不是 `/`，否则打包后白屏

### 第二步：安装打包依赖

```bash
npm install electron@27.3.0 electron-packager@17.1.2 --save-dev
```

可选设置 npm 镜像（解决 Electron 下载慢的问题）：

```bash
# Windows PowerShell
$env:ELECTRON_MIRROR = "https://npmmirror.com/mirrors/electron/"
```

### 第三步：创建 Electron 入口文件

项目根目录创建 `index.js`（主进程入口）：

```javascript
const { app, BrowserWindow, shell } = require('electron')
const path = require('node:path')

// 禁用 GPU（解决部分 Windows 环境下的崩溃问题）
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('no-sandbox')

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    title: '电子木鱼',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // 阻止外部链接打开
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 加载页面（注意用相对路径）
  mainWindow.loadFile(path.join(__dirname, 'dist/index.html'))
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

同目录创建 `preload.js`（预加载脚本）：

```javascript
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
})
```

> ⚠️ **易错点**：`loadFile` 的路径必须是相对于 `__dirname` 的正确路径

### 第四步：构建 Web 资源

```bash
npm run build
# 或直接调用
node node_modules/vite/bin/vite.js build
```

### 第五步：打包为 exe

使用 electron-packager：

```bash
# 设置镜像（PowerShell）
$env:ELECTRON_MIRROR = "https://npmmirror.com/mirrors/electron/"

# 执行打包
node node_modules/electron-packager/bin/electron-packager.js . "电子木鱼" --platform=win32 --arch=x64 --out=release --overwrite --prune=true
```

参数说明：
- `.` - 当前目录为项目根
- `"电子木鱼"` - 生成的 exe 名称
- `--platform=win32` - 目标平台
- `--arch=x64` - 64 位架构
- `--out=release` - 输出目录
- `--overwrite` - 覆盖已存在的输出
- `--prune=true` - 清理 node_modules 中无关的包

### 第六步：测试 exe

打包成功后，exe 位于：

```
release/电子木鱼-win32-x64/电子木鱼.exe
```

> ⚠️ **易错点**：如果从下载目录直接运行可能有问题，建议将整个文件夹复制到桌面再测试

## 常见问题

### 1. 启动报错：无法找到入口文件

**错误信息**：`The main entry point to your app was not found`

**解决方案**：
- 确保根目录有 `index.js`
- 确保 `package.json` 的 `type` 为 `commonjs`（不是 `module`）

### 2. 启动报错：require() of ES Module

**错误信息**：`require() of ES Module not supported`

**解决方案**：
- 将 `package.json` 中的 `"type": "module"` 改为 `"type": "commonjs"`
- 或将入口文件改为 `.cjs` 后缀

### 3. 打包后白屏

**原因**：资源路径使用了绝对路径 `/assets/...`

**解决方案**：
- 在 `vite.config.js` 中设置 `base: './'`
- 确保 HTML 中的资源引用是相对路径 `./assets/...`

### 4. Windows 事件日志报错：0x67a3fed5

**原因**：通常是 GPU/图形驱动问题或 Windows 存储访问限制

**解决方案**：
- 在入口文件中添加 GPU 禁用开关
- 将整个输出文件夹复制到桌面再运行

### 5. electron-builder 打包失败：winCodeSign 下载超时

**原因**：网络问题导致无法下载代码签名工具

**解决方案**：使用 electron-packager 代替 electron-builder（本文档采用的方法）

## 目录结构

打包后的目录结构：

```
release/电子木鱼-win32-x64/
├── 电子木鱼.exe          # 主程序
├── chrome_100_percent.pak
├── chrome_200_percent.pak
├── d3dcompiler_47.dll
├── ffmpeg.dll
├── icudtl.dat
├── libEGL.dll
├── libGLESv2.dll
├── locales/
├── resources/
│   └── app/
│       ├── dist/         # Web 资源
│       │   ├── index.html
│       │   ├── assets/
│       │   └── fish.svg
│       ├── index.js      # 主进程入口
│       ├── preload.js    # 预加载脚本
│       ├── package.json
│       └── node_modules/
├── resources.pak
├── snapshot_blob.bin
├── v8_context_snapshot.bin
├── version
├── vk_swiftshader.dll
└── vulkan-1.dll
```

## 自动化脚本

为简化流程，可创建 `build.ps1`：

```powershell
# build.ps1
$env:ELECTRON_MIRROR = "https://npmmirror.com/mirrors/electron/"
Set-Location "F:\Work\workspace\Electronic-Wooden-Fish"

# 构建 Web 资源
& "C:\Program Files\nodejs\node.exe" node_modules/vite/bin/vite.js build

# 打包
& "C:\Program Files\nodejs\node.exe" node_modules/electron-packager/bin/electron-packager.js . "电子木鱼" --platform=win32 --arch=x64 --out=release --overwrite --prune=true

Write-Host "Build complete!"
```

执行：`powershell -ExecutionPolicy Bypass -File build.ps1`