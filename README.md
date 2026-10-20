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
| Encoding | encoding_rs + chardetng |
| Encryption | AES-256-GCM (OS keyring on Win/Linux, local file on macOS) |
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

The installer can be found in `src-tauri/target/release/bundle/`.

## Contributing

All forms of participation are welcome: code, UI/UX, testing, documentation, translation, bug reports, and product suggestions.

Even if you are not a developer, you are welcome to discuss product direction in [Issues](https://github.com/MaleyGoz/FinchPad/issues).

## License

This project is licensed under the **MIT License**.

Copyright (c) 2026 MaleyGoz

This means you are free to use, modify, and distribute this project, including for commercial purposes, as long as you retain the original copyright and license notices. For more details, please refer to the [LICENSE](https://license/) file in the project root.

------

<div align="center"> <sub>Built with Rust · Tauri · Svelte · and a focus on simplicity.</sub> </div>
