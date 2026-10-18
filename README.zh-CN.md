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

## 为什么选择 FinchPad？

| 功能 / 特性                | **FinchPad**                     | Windows 记事本 | macOS TextEdit | Linux gedit  | Notepad++          | Sublime Text          |
| :------------------------- | :------------------------------- | :------------- | :------------- | :----------- | :----------------- | :-------------------- |
| **跨平台支持**             | ✅ **Win / macOS / Linux**        | ❌ 仅 Windows   | ❌ 仅 macOS     | ❌ 主要 Linux | ❌ 仅 Windows       | ✅ Win / macOS / Linux |
| **极致轻量 (安装包/内存)** | ✅ **~5MB / ~10MB**               | ✅ 极小 / 低    | ✅ 小 / 低      | ✅ 小 / 低    | ⚠️ 小 / ~30-60MB    | ✅ ~80-150MB           |
| **启动速度 (冷启动)**      | ✅ **极快 (原生)**                | ✅ 瞬间         | ✅ 极快         | ✅ 快         | ✅ <0.5s            | ✅ 快 (<1s)            |
| **现代多标签页**           | ✅ **浏览器式拖拽/中键关闭**      | ⚠️ 基础标签页   | ❌ 单窗口单文档 | ⚠️ 基础标签页 | ✅ 成熟标签页       | ✅ 成熟标签页          |
| **崩溃/重启会话恢复**      | ✅ **AES-256 加密缓存，永不丢稿** | ❌ 无           | ❌ 无           | ❌ 无         | ⚠️ 基础恢复，未加密 | ⚠️ 热退出恢复          |
| **外部修改实时检测**       | ✅ **激活标签即弹窗，防覆盖**     | ❌ 无           | ❌ 无           | ❌ 无         | ⚠️ 需手动重载       | ⚠️ 提示较弱            |
| **大文件懒加载 (>50MB)**   | ✅ **按需加载，不卡 UI**          | ❌ 大文件卡顿   | ❌ 大文件吃力   | ⚠️ 一般       | ✅ 处理能力强       | ✅ 极强                |
| **内置文本对比 (Diff)**    | ✅ **快速查看差异**               | ❌ 无           | ❌ 无           | ❌ 无         | ⚠️ 需插件           | ⚠️ 需插件              |
| **标签内联重命名 (F2)**    | ✅ **像资源管理器一样改名**       | ❌ 无           | ❌ 无           | ❌ 无         | ❌ 无               | ❌ 无                  |
| **无边框现代 UI**          | ✅ **跨平台一致的自绘标题栏**     | ❌ 系统原生     | ❌ 系统原生     | ❌ 系统原生   | ❌ 传统 Win32       | ✅ 原生优雅            |
| **价格 / 授权**            | ✅ **免费开源 (MIT)**             | ✅ 系统自带     | ✅ 系统自带     | ✅ 免费开源   | ✅ 免费开源         | ❌ 收费 ($99)          |

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

| 模块       | 技术                                                        |
| ---------- | ----------------------------------------------------------- |
| 编程语言   | Rust                                                        |
| 桌面框架   | Tauri 2                                                     |
| 前端       | SvelteKit 5                                                 |
| 编辑器内核 | Monaco Editor                                               |
| 编码       | encoding_rs + chardetng                                     |
| 加密       | AES-256-GCM (Win/Linux 基于 OS keyring，macOS 基于本地文件) |
| 平台       | Windows / Linux / macOS                                     |

FinchPad **不使用 Electron**，采用轻量化原生架构。基于 Tauri 2、Svelte 5、Rust 和 Monaco Editor 构建。

## 构建

需要 [Rust](https://rustup.rs/) 和 [Node.js](https://nodejs.org/)。

```bash
git clone https://github.com/MaleyGoz/FinchPad.git
cd FinchPad
npm install
npm run tauri build
```

安装包位于 `src-tauri/target/release/bundle/`。

## 参与贡献

欢迎各种形式的参与：代码、UI/UX、测试、文档、翻译、Bug 报告、产品建议。

即使不是开发者，也欢迎在 [Issues](https://github.com/MaleyGoz/FinchPad/issues) 里讨论产品方向。

## 开源协议

本项目采用 **MIT License** 开源协议。

Copyright (c) 2026 MaleyGoz

这意味着你可以自由地使用、修改、分发本项目，包括用于商业用途，只需保留原始的版权声明和许可声明即可。详细信息请参阅项目根目录下的 [LICENSE](https://license/) 文件。

------

<div align="center"> <sub>Built with Rust · Tauri · Svelte · and a focus on simplicity.</sub> </div> 

