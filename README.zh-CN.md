<div align="center">

<img src="static/icon.png" width="100" alt="TXT Editor">

# TXT Editor

**一款现代、轻量化、多标签的纯文本编辑器**

支持 Windows / Linux / macOS

<p>
<a href="README.md">English</a> · <a href="README.zh-CN.md">简体中文</a>
</p>

</div>

---

## 简介

TXT Editor 旨在成为更好的系统默认文本编辑器。

它比系统自带的记事本更强大，又比 VSCode 等专业编辑器更轻量。

> **最大公约数，最少不必要的功能。**

每一个功能都回答一个问题：**大多数用户真的需要它吗？**

## 截图

<p align="center">
  <a href="assets/screenshot-main.zh-CN.png"><img src="assets/screenshot-main.zh-CN.png" width="32%" alt="主界面"></a>
  <a href="assets/screenshot-themes.zh-CN.png"><img src="assets/screenshot-themes.zh-CN.png" width="32%" alt="深色主题"></a>
  <a href="assets/screenshot-large-file.zh-CN.png"><img src="assets/screenshot-large-file.zh-CN.png" width="32%" alt="大文件懒加载"></a>
</p>

<p align="center">
  <sub>主界面 · 深色主题 · 大文件懒加载</sub>
</p>

## 特性

| 功能 | 说明 |
|------|------|
| **多标签** | 拖拽重排、右键菜单、鼠标中键关闭、溢出下拉 |
| **会话恢复** | 关闭后重开，标签和内容自动回来 |
| **加密缓存** | 未保存内容用 AES-256-GCM 加密存储 |
| **永不丢失** | 崩溃后仍可恢复上次编辑的内容 |
| **大文件友好** | 超过 50MB 的文件走懒加载，用户自主决定 |
| **语法高亮** | 支持 20+ 种常见语言（基于 Monaco）|
| **编码检测** | 自动识别 UTF-8 / UTF-16 / GBK 等 |
| **无边框窗口** | 类似浏览器标签栏的现代 UI |
| **5 套主题** | 白色 / 灰色 / 米黄 / 护眼绿 / 深色 |
| **中英文** | 界面语言自动跟随系统 |

## 技术架构

| 模块 | 技术 |
|------|------|
| 编程语言 | Rust |
| 桌面框架 | Tauri 2 |
| 前端 | SvelteKit 5 |
| 编辑器内核 | Monaco Editor |
| 文本缓冲 | Rope (ropey) |
| 编码 | encoding_rs + chardetng |
| 加密 | AES-256-GCM + OS keyring |
| 平台 | Windows / Linux / macOS |

TXT Editor **不使用 Electron**，采用轻量化原生架构。

## 下载

从 [Releases](https://github.com/MaleyGoz/TXT-Editor/releases) 页面下载最新版本：

- **Windows**：`TXT Editor_x.x.x_x64.msi` 安装包
- **其它平台**：暂无官方构建

## 构建

需要 [Rust](https://rustup.rs/) 和 [Node.js](https://nodejs.org/)。

```bash
git clone https://github.com/MaleyGoz/TXT-Editor.git
cd TXT-Editor
npm install
npm run tauri build
```

产物位于 `src-tauri/target/release/bundle/`。

## 参与贡献

欢迎各种形式的参与：代码、UI/UX、测试、文档、翻译、Bug 报告、产品建议。

即使不是开发者，也欢迎在 [Issues](https://github.com/MaleyGoz/TXT-Editor/issues) 里讨论产品方向。

## 开源协议

MIT License —— 自由使用、修改、分发。

---

<div align="center">
<sub>Built with Rust · Tauri · Svelte · and a focus on simplicity.</sub>
</div>