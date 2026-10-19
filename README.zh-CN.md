<div align="center">

<img src="static/icon.png" width="100" alt="FinchPad">

# FinchPad

**一款现代、轻量化、多标签的纯文本编辑器**

支持 Windows / Linux / macOS

<p>
<a href="README.md">English</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="https://github.com/MaleyGoz/FinchPad/releases">下载</a>
</p>
</div>

---

## 简介

FinchPad 旨在成为 Windows、macOS 和 Linux 上更好的默认文本编辑器。

它比系统自带的记事本更强大，又比 VSCode 等专业编辑器更轻量。

> **最大公约数，最少不必要的功能。**
> 每一个功能都回答一个问题：**大多数用户真的需要它吗？**

## 特性

| 功能 | 说明 |
| --- | --- |
| **极致轻量与高性能** | 基于 Rust 构建，安装包约 5MB，运行内存约 10MB，保持快速启动与低资源占用 |
| **多标签页编辑** | 采用现代浏览器式标签页设计，支持拖拽重排、右键菜单、鼠标中键关闭、溢出下拉，轻松管理多个文档 |
| **会话恢复** | 即使遇到软件崩溃、系统重启或意外断电，也能恢复之前的工作状态 |
| **安全缓存** | 未保存内容使用系统级密钥管理与 AES-256-GCM 加密保护本地缓存数据 |
| **文件冲突处理** | 智能检测文件变化，帮助处理编辑冲突 |
| **文本对比** | 快速查看文件之间的差异 |
| **大文件支持** | 超过 50MB 的文件走懒加载，用户自主决定，快速打开和编辑大型文本文件 |
| **语法高亮** | 支持 20+ 种常见语言（基于 Monaco） |
| **编码检测** | 自动识别 UTF-8 / UTF-16 / GBK 等 |
| **无边框窗口** | 类似浏览器标签栏的现代 UI |
| **自定义主题** | 支持个性化编辑环境，内置 5 套主题（白色 / 灰色 / 米黄 / 护眼绿 / 深色） |
| **跨平台与多语言** | 支持 Windows / macOS / Linux，界面语言（中英文）自动跟随系统 |

## 截图

<p align="center">
  <img src="assets/screenshot-main.zh-CN.png" width="90%" alt="主界面">
  <br><sub>主界面</sub>
</p>

<p align="center">
  <img src="assets/screenshot-themes.zh-CN.png" width="90%" alt="深色主题">
  <br><sub>深色主题</sub>
</p>

<p align="center">
  <img src="assets/screenshot-compare.png" width="90%" alt="文本对比">
  <br><sub>文本对比</sub>
</p>

<p align="center">
  <img src="assets/screenshot-large-file.zh-CN.png" width="90%" alt="大文件懒加载">
  <br><sub>大文件懒加载</sub>
</p>

## 技术架构

| 模块 | 技术 |
| --- | --- |
| 编程语言 | Rust |
| 桌面框架 | Tauri 2 |
| 前端 | SvelteKit 5 |
| 编辑器内核 | Monaco Editor |
| 文本缓冲 | Rope (ropey) |
| 编码 | encoding_rs + chardetng |
| 加密 | AES-256-GCM + OS keyring |
| 平台 | Windows / Linux / macOS |

FinchPad **不使用 Electron**，采用轻量化原生架构。基于 Tauri 2、Svelte 5、Rust 和 Monaco Editor 构建。

## 构建

需要 [Rust](https://rustup.rs/) 和 [Node.js](https://nodejs.org/)。

```bash
git clone https://github.com/MaleyGoz/FinchPad.git
cd FinchPad
npm install
npm run tauri build
```

安装包位于 src-tauri/target/release/bundle/。

## 参与贡献
欢迎各种形式的参与：代码、UI/UX、测试、文档、翻译、Bug 报告、产品建议。

即使不是开发者，也欢迎在 Issues 里讨论产品方向。

## 隐私声明

FinchPad 秉持**绝对隐私、纯本地化**的设计理念：

1. **数据纯本地运行**：你输入的所有文本、编辑记录及缓存文件，均 100% 存储在你的本地设备中（且采用 AES-256-GCM 加密）。我们**绝不收集、不上传**你的任何文件内容、使用习惯或设备信息。
2. **无遥测与追踪**：软件不包含任何后台遥测、数据统计或用户行为追踪代码。
3. **网络请求说明**：
   - 仅在触发“版本更新检查”时，会向 GitHub API 发起匿名请求。
   - 在使用 Markdown / HTML 预览功能时，如果你的文档中包含了外部网络资源（如图片、链接），WebView 可能会自动加载这些外部内容。
   - 除上述情况外，FinchPad 绝不主动发起网络连接。

## 开源协议
本项目采用 MIT License 开源协议。

Copyright (c) 2026 MaleyGoz

这意味着你可以自由地使用、修改、分发本项目，包括用于商业用途，只需保留原始的版权声明和许可声明即可。详细信息请参阅项目根目录下的 LICENSE 文件。

<div align="center"> <sub>Built with Rust · Tauri · Svelte · and a focus on simplicity.</sub> </div> 

