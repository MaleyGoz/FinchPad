<div align="center">

<img src="static/icon.png" width="100" alt="TXT Editor">

# TXT Editor

**A modern, lightweight, multi-tab plain-text editor**

Available for Windows / Linux / macOS

<p>
<a href="README.md">English</a> · <a href="README.zh-CN.md">简体中文</a>
</p>

</div>

---

## Introduction

TXT Editor aims to be a better default text editor.

It is more powerful than the built-in Notepad, yet lighter than professional editors like VSCode.

> **The greatest common denominator, the fewest unnecessary features.**

Every feature answers one question: **Do most users really need it?**

## Screenshots

<p align="center">
  <a href="assets/screenshot-main.png"><img src="assets/screenshot-main.png" width="32%" alt="Main window"></a>
  <a href="assets/screenshot-themes.png"><img src="assets/screenshot-themes.png" width="32%" alt="Dark theme"></a>
  <a href="assets/screenshot-large-file.png"><img src="assets/screenshot-large-file.png" width="32%" alt="Large file lazy loading"></a>
</p>

<p align="center">
  <sub>Main window · Dark theme · Large file lazy loading</sub>
</p>

## Features

| Feature | Description |
|---------|-------------|
| **Multi-tab** | Drag to reorder, right-click menu, middle-click to close, overflow dropdown |
| **Session restore** | Reopen TXT Editor and your tabs come back automatically |
| **Encrypted cache** | Unsaved content is encrypted with AES-256-GCM |
| **Never lose work** | Recover your last edits even after a crash |
| **Large file friendly** | Files over 50MB are lazily loaded, at your discretion |
| **Syntax highlighting** | 20+ common languages supported (powered by Monaco) |
| **Encoding detection** | Auto-detects UTF-8 / UTF-16 / GBK, and more |
| **Borderless window** | Modern UI with browser-style tabs |
| **5 themes** | White / Gray / Sepia / Eye-care Green / Dark |
| **Bilingual** | UI language follows your system settings |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | Rust |
| Desktop framework | Tauri 2 |
| Frontend | SvelteKit 5 |
| Editor core | Monaco Editor |
| Text buffer | Rope (ropey) |
| Encoding | encoding_rs + chardetng |
| Encryption | AES-256-GCM + OS keyring |
| Platforms | Windows / Linux / macOS |

TXT Editor **does not use Electron** — it is built on a lightweight native architecture.

## Download

Get the latest release from the [Releases](https://github.com/MaleyGoz/TXT-Editor/releases) page:

- **Windows**: `TXT Editor_x.x.x_x64.msi` installer
- **Other platforms**: No official build yet

## Build from Source

Requires [Rust](https://rustup.rs/) and [Node.js](https://nodejs.org/).

```bash
git clone https://github.com/MaleyGoz/TXT-Editor.git
cd TXT-Editor
npm install
npm run tauri build
```

The output artifacts will be in `src-tauri/target/release/bundle/`.

## Contributing

All forms of contribution are welcome: code, UI/UX, testing, documentation, translation, bug reports, and product feedback.

Even if you're not a developer, feel free to join the discussion in [Issues](https://github.com/MaleyGoz/TXT-Editor/issues).

## License

MIT License — free to use, modify, and distribute.

---

<div align="center">
<sub>Built with Rust · Tauri · Svelte · and a focus on simplicity.</sub>
</div>