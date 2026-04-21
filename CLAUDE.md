# Stools - 小红书排版工具

## 项目概述

小红书笔记图片排版工具，将纯文本自动排版为 3:4 比例（1080x1440px）的图片卡片，模拟 ChatGPT iOS 端的渲染风格（黑底白字、PingFang SC 字体），支持预览和批量导出 PNG。

**线上地址：** https://st.fangs.cc
**仓库：** https://github.com/imfangs/stools

## 技术栈

- **框架：** React 19 + TypeScript
- **构建：** Vite 8 + vite-plugin-singlefile（产物为单个 HTML 文件，可离线使用）
- **样式：** Tailwind CSS 4
- **图片导出：** html2canvas-pro → JSZip + file-saver
- **包管理：** npm（项目根目录有 pnpm-lock.yaml 但 package-lock.json 为主）

## 项目结构

```
src/
  core/           # 核心管线：text → elements → pages → images
    parser.ts     # 文本解析（# h1, --- 分割线, 空行, 正文）
    paginator.ts  # 分页引擎，DOM 测量实际文本高度
    exporter.ts   # html2canvas 截图 + ZIP 打包下载
  components/     # UI 组件
    Editor.tsx    # 右侧文本编辑器
    Preview.tsx   # 左侧图片预览网格
    ImageCard.tsx # 单张卡片渲染（ResizeObserver 缩放）
    ActionBar.tsx # 生成/下载按钮
    ConfigPanel.tsx # 右侧滑出配置面板（24 项布局参数）
  config/
    defaults.ts   # 默认布局配置
    store.ts      # localStorage 持久化 + JSON 导入导出
  types.ts        # ParsedElement, Page, LayoutConfig 类型定义
  App.tsx         # 根组件，状态管理与编排
```

## 核心数据流

```
用户输入文本 → parser.parseText() → ParsedElement[]
  → paginator.paginate(elements, config) → Page[]
  → ImageCard 渲染各页 → exporter.downloadAllImages() → PNG/ZIP
```

## 配置系统

- 24 项可调参数：图片尺寸、内边距、H1/正文字号行高间距、分割线样式、颜色、字体、页码等
- 存储在 `localStorage` key `stools-config`
- 支持 JSON 导出/导入，方便多人共享配置

## 部署

- **自动部署：** push 到 main 触发 GitHub Actions → GitHub Pages
- **手动部署：** `bash deploy.sh` 构建后推送到 gh-pages 分支
- 自定义域名通过 `public/CNAME` 配置为 `st.fangs.cc`

## 开发命令

```bash
npm install    # 安装依赖
npm run dev    # 本地开发 http://localhost:5173
npm run build  # 生产构建（单文件 HTML）
npm run lint   # ESLint 检查
```

## 注意事项

- 分页引擎使用 DOM 测量文本高度（`measureWithDOM`），需要浏览器环境
- 图片导出 scale=1，确保输出精确 1080x1440 像素
- 无测试覆盖，修改 core/ 下的逻辑后需手动验证排版和导出效果
- 需求文档见 `需求.md`，原型图见 `原型.png`
