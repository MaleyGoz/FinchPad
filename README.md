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
| Text Buffer | Rope (ropey) |
| Encoding | encoding_rs + chardetng |
| Encryption | AES-256-GCM + OS keyring |
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

Even if you are not a developer, you are welcome to discuss product direction in Issues.

## License

This project is licensed under the MIT License.

Copyright (c) 2026 MaleyGoz

This means you are free to use, modify, and distribute this project, including for commercial purposes, as long as you retain the original copyright and license notices. For more details, please refer to the LICENSE file in the project root.

<div align="center"> <sub>Built with Rust · Tauri · Svelte · and a focus on simplicity.</sub> </div> 