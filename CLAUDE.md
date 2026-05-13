# 项目命令

## 构建 Web 资源
```bash
cd "F:/Work/workspace/Electronic-Wooden-Fish" && node node_modules/vite/bin/vite.js build
```

## 打包为 Windows exe
```bash
cd "F:/Work/workspace/Electronic-Wooden-Fish" && ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ node node_modules/electron-packager/bin/electron-packager.js . "电子木鱼" --platform=win32 --arch=x64 --out=release --overwrite --prune=true
```

## 常用命令

- **开发模式**：`npm run dev`
- **生产构建**：使用上述构建命令