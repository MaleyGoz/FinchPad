<div align="center">

<img src="static/icon.png" width="100" alt="FinchPad">

# FinchPad

**A modern, lightweight, multi-tab plain text editor**

Supports Windows / Linux / macOS

<p>
<a href="README.md">English</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="https://github.com/MaleyGoz/FinchPad/releases">Download</a>
</p>
</div>

---

## Introduction

FinchPad aims to be a better default text editor on Windows, macOS, and Linux.

It is more powerful than the built-in Notepad, yet lighter than professional editors like VSCode.

> **Maximum common ground, minimum unnecessary features.**
> Every feature answers one question: **Do most users really need it?**

<<<<<<< HEAD
## Features

| Feature | Description |
| --- | --- |
| **Ultra-lightweight & High-performance** | Built with Rust. Installer is ~5MB, memory usage is ~10MB, maintaining fast startup and low resource consumption. |
| **Multi-tab Editing** | Modern browser-style tabs. Supports drag-and-drop reordering, context menus, middle-click to close, and overflow dropdown for easy document management. |
| **Session Recovery** | Restores your previous working state even after crashes, system restarts, or unexpected power outages. |
| **Secure Cache** | Unsaved content is encrypted locally using OS-level keyring and AES-256-GCM. |
| **File Conflict Handling** | Intelligently detects file changes and helps resolve editing conflicts. |
| **Text Diff** | Quickly view differences between files. |
| **Large File Support** | Files over 50MB use lazy loading at your discretion, allowing fast opening and editing of large text files. |
| **Syntax Highlighting** | Supports 20+ common languages (powered by Monaco). |
| **Encoding Detection** | Automatically detects UTF-8 / UTF-16 / GBK, etc. |
| **Borderless Window** | Modern UI similar to a browser tab bar. |
| **Customizable Themes** | Personalized editing environment with 5 built-in themes (White / Gray / Sepia / Green / Dark). |
| **Cross-platform & Multi-language** | Supports Windows / macOS / Linux. UI language (Chinese/English) automatically follows the system. |
=======
## Why Choose FinchPad?

| Feature / Attribute | **FinchPad** | Windows Notepad | macOS TextEdit | Linux gedit | Notepad++ | Sublime Text |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Cross-platform Support** | ✅ **Win / macOS / Linux** | ❌ Windows only | ❌ macOS only | ❌ Linux primarily | ❌ Windows only | ✅ Win / macOS / Linux |
| **Ultra-lightweight (Installer / RAM)** | ✅ **~5MB / ~10MB** | ✅ Tiny / Low | ✅ Small / Low | ✅ Small / Low | ⚠️ Small / ~30-60MB | ✅ ~80-150MB |
| **Cold Start Speed** | ✅ **Extremely fast (Native)** | ✅ Instant | ✅ Extremely fast | ✅ Fast | ✅ <0.5s | ✅ Fast (<1s) |
| **Modern Tabs** | ✅ **Browser-style drag & middle-click close** | ⚠️ Basic tabs | ❌ Single window only | ⚠️ Basic tabs | ✅ Mature tabs | ✅ Mature tabs |
| **Crash/Restart Session Recovery** | ✅ **AES-256 encrypted cache, never lose work** | ❌ None | ❌ None | ❌ None | ⚠️ Basic, unencrypted | ⚠️ Hot exit recovery |
| **External Modification Detection** | ✅ **Popup on tab activation, prevents overwriting** | ❌ None | ❌ None | ❌ None | ⚠️ Manual reload needed | ⚠️ Weak prompts |
| **Large File Lazy Loading (>50MB)** | ✅ **On-demand loading, no UI freeze** | ❌ Laggy on large files | ❌ Struggles with large files | ⚠️ Average | ✅ Good capability | ✅ Excellent |
| **Built-in Text Diff** | ✅ **Quickly view differences** | ❌ None | ❌ None | ❌ None | ⚠️ Requires plugin | ⚠️ Requires plugin |
| **Tab Inline Rename (F2)** | ✅ **Rename like a file explorer** | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| **Borderless Modern UI** | ✅ **Cross-platform consistent custom title bar** | ❌ System native | ❌ System native | ❌ System native | ❌ Traditional Win32 | ✅ Native elegance |
| **Price / License** | ✅ **Free & Open Source (MIT)** | ✅ Built-in | ✅ Built-in | ✅ Free & Open Source | ✅ Free & Open Source | ❌ Paid ($99) |
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368

## Screenshots

<p align="center">
  <img src="assets/screenshot-main.png" width="90%" alt="Main Interface">
  <br><sub>Main Interface</sub>
</p>

<p align="center">
  <img src="assets/screenshot-themes.png" width="90%" alt="Dark Theme">
  <br><sub>Dark Theme</sub>
</p>

<p align="center">
  <img src="assets/screenshot-compare.png" width="90%" alt="Text Diff">
  <br><sub>Text Diff</sub>
</p>

<p align="center">
  <img src="assets/screenshot-large-file.png" width="90%" alt="Large File Lazy Loading">
  <br><sub>Large File Lazy Loading</sub>
</p>

## Tech Stack

| Module | Technology |
| --- | --- |
| Language | Rust |
| Desktop Framework | Tauri 2 |
| Frontend | SvelteKit 5 |
| Editor Core | Monaco Editor |
<<<<<<< HEAD
| Text Buffer | Rope (ropey) |
| Encoding | encoding_rs + chardetng |
| Encryption | AES-256-GCM + OS keyring |
=======
| Encoding | encoding_rs + chardetng |
| Encryption | AES-256-GCM (OS keyring on Win/Linux, local file on macOS) |
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
| Platform | Windows / Linux / macOS |

FinchPad **does not use Electron**, adopting a lightweight native architecture. Built with Tauri 2, Svelte 5, Rust, and Monaco Editor.

## Build

Requires [Rust](https://rustup.rs/) and [Node.js](https://nodejs.org/).

```bash
git clone https://github.com/MaleyGoz/FinchPad.git
cd FinchPad
npm install
npm run tauri build
```
The installer can be found in src-tauri/target/release/bundle/.

## Contributing

All forms of participation are welcome: code, UI/UX, testing, documentation, translation, bug reports, and product suggestions.

<<<<<<< HEAD
Even if you are not a developer, you are welcome to discuss product direction in Issues.

## Privacy Policy

FinchPad is designed with a **privacy-first, purely local** philosophy:

1. **100% Local Data**: All your text, edits, and cached files are stored locally on your device (encrypted with AES-256-GCM). We **never collect or upload** your file contents, usage habits, or device information.
2. **No Telemetry or Tracking**: The application contains no background telemetry, analytics, or user behavior tracking code.
3. **Network Activities**:
   - An anonymous request is sent to the GitHub API *only* when checking for software updates.
   - When using Markdown/HTML preview, the WebView may load external network resources (e.g., images or links) if your document references them.
   - Aside from the above, FinchPad never initiates network connections.

## License

This project is licensed under the MIT License.

Copyright (c) 2026 MaleyGoz

This means you are free to use, modify, and distribute this project, including for commercial purposes, as long as you retain the original copyright and license notices. For more details, please refer to the LICENSE file in the project root.

<div align="center"> <sub>Built with Rust · Tauri · Svelte · and a focus on simplicity.</sub> </div> 
=======
Even if you are not a developer, you are welcome to discuss product direction in [Issues](https://github.com/MaleyGoz/FinchPad/issues).

## License

This project is licensed under the **MIT License**.

Copyright (c) 2026 MaleyGoz

This means you are free to use, modify, and distribute this project, including for commercial purposes, as long as you retain the original copyright and license notices. For more details, please refer to the [LICENSE](https://license/) file in the project root.

------

<div align="center"> <sub>Built with Rust · Tauri · Svelte · and a focus on simplicity.</sub> </div>
>>>>>>> e8704ae241c732be062884b4e02f27a8e3b04368
