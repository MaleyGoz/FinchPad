<div align="center">

<img src="assets/logo.png" width="100">

# TXT

**A modern, lightweight, multi-tab plain-text editor for Windows, Linux, and macOS.**

TXT aims to become a better default text editor.

<p>
<a href="README.md">English</a> · <a href="README.zh-CN.md">简体中文</a>
</p>

</div>

## Why TXT?

There is a gap between basic system text editors and powerful development tools.

TXT focuses on the common needs of everyday users — and does them well.

> **Maximum common ground. Minimum unnecessary features.**

TXT is not designed to do everything.
It is designed to do what most people need, without unnecessary features, complexity, or resource consumption.

## Core Design

### 1. Plain Text Only

TXT always works with plain text.

Pasted rich text, HTML, and other formatting are stripped automatically, keeping the editing experience predictable and clean.

### 2. Lightweight & Native

Built with Rust and Slint instead of Electron.

Fast startup, low resource usage, and a small footprint are core goals.

### 3. Simple Multi-Tab Editing

Multiple files, one clean interface.

No traditional menu bar. Advanced functions remain accessible through the command palette and contextual menus.

### 4. Never Lose Your Work

Closing a tab should not mean losing an unfinished draft.

TXT automatically saves uncommitted drafts to an encrypted local cache and restores them when needed.

### 5. Built for Large Files

TXT uses a rope-based text buffer to keep editing responsive even with large text files.

### 6. Secure by Default

Session drafts are protected with AES-256-GCM encryption.

Encryption keys are stored using the operating system's secure storage.

## Technology

| Component           | Technology              |
| ------------------- | ----------------------- |
| Language            | Rust                    |
| GUI                 | Slint                   |
| Text Buffer         | Rope                    |
| Syntax Highlighting | syntect                 |
| Encoding            | encoding_rs             |
| Encryption          | AES-256-GCM             |
| Platforms           | Windows · Linux · macOS |

## Product Principle

> **Find the common needs of ordinary users, and do them exceptionally well.**

Before adding a feature, TXT asks:

**Do most users actually need this?**

If the answer is no, it probably does not belong in TXT.

## Roadmap

* [ ] Core text editing
* [ ] Multi-tab editing
* [ ] Cross-platform support
* [ ] Session recovery
* [ ] Large-file performance
* [ ] Encoding support
* [ ] Encrypted session cache
* [ ] Syntax highlighting
* [ ] Packaging & distribution

The roadmap will evolve with the project and community feedback.

## Contributing

TXT is an open-source project and welcomes contributions.

You can help with:

* Code
* UI/UX
* Performance
* Security
* Testing
* Documentation
* Localization
* Bug reports
* Product ideas

**You don't have to be a developer to contribute.**

## License

TXT is released under the **MIT License**.

Free to use, modify, distribute, and build upon.

---

<p align="center">
  <sub>Built with Rust · Slint · and a focus on simplicity.</sub>
</p>
