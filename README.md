# TXT
<p align="center">
  <img src="assets/logo.png" width="180">
</p>
**A modern, lightweight, multi-tab plain-text editor for Windows, Linux, and macOS.**

TXT aims to become a better default text editor.

It is designed around one simple idea:

> **Find the common needs of ordinary users, and do them exceptionally well.**

TXT is not designed to do everything.
It is designed to do **what most people need** — without unnecessary features, complexity, or resource consumption.

---

## Why TXT?

Today's default text editors generally fall into two directions:

* **Too basic** — limited editing capabilities and poor handling of larger or more demanding tasks.
* **Too complex** — powerful editors such as IDEs provide far more functionality than ordinary users need.

TXT aims to find the **common ground** between them:

> **More capable than a basic system editor.
> Simpler and lighter than a development environment.**

The goal is not to build another feature-heavy editor.

The goal is to build a text editor that could eventually be good enough to become a **default editor for an operating system**.

---

## Core Design

### 1. Plain Text Only

TXT is a **plain-text editor**.

Pasted rich text is automatically converted to plain text.

No RTF. No HTML formatting. No unnecessary document features.

### 2. Lightweight & Native

TXT should start fast, consume little memory, and remain small.

No Electron.

The project favors native, lightweight technologies wherever practical.

### 3. Minimal Multi-Tab Interface

Multiple documents, one simple interface.

No traditional menu bar.

Features should remain discoverable through contextual menus, the command palette, and a minimal toolbar.

### 4. Never Lose Your Work

Closing a tab does not have to mean losing an unsaved document.

Unsaved documents are silently preserved in an encrypted local cache and restored when TXT is opened again.

The user should not have to think about recovery.

### 5. Large Files, No Lag

TXT is designed for efficient editing of large text files.

A rope-based text buffer is used to avoid unnecessary copying and maintain responsive editing performance.

### 6. Secure by Default

Session data and temporary documents may contain sensitive information.

Local caches are encrypted and protected using the operating system's secure storage where available.

---

## Technology

| Component           | Technology              |
| ------------------- | ----------------------- |
| Language            | Rust                    |
| GUI                 | Slint                   |
| Text Buffer         | Rope                    |
| Syntax Highlighting | syntect                 |
| Encoding            | encoding_rs             |
| Encryption          | AES-256-GCM             |
| Platforms           | Windows / Linux / macOS |

TXT intentionally avoids Electron in favor of a lightweight native architecture.

---

## Product Principle

TXT follows one rule:

> **Maximum common ground, minimum unnecessary features.**

Every feature should be evaluated by one question:

**Do most users actually need this?**

If not, it probably does not belong in TXT.

---

## Roadmap

The roadmap will be driven by real user needs and community discussion.

Initial priorities:

* [ ] Core text editing
* [ ] Multi-tab editing
* [ ] Cross-platform support
* [ ] Session recovery
* [ ] Large-file performance
* [ ] Encoding support
* [ ] Encrypted cache
* [ ] Syntax highlighting
* [ ] Packaging & distribution

---

## Contributing

**TXT is looking for developers, designers, testers, and anyone interested in building a better everyday text editor.**

You can contribute through:

* Code
* UI / UX
* Performance
* Security
* Testing
* Documentation
* Localization
* Product discussions
* Bug reports

You don't have to be a developer to contribute.

The product direction is intentionally open to discussion.

**If you believe everyday text editors can be simpler, faster, and better, you're welcome to join.**

---

## License

TXT is free and open-source software released under the **MIT License**.

Contributions, forks, and redistribution are welcome.
