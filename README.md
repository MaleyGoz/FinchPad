# TXT Editor

**A modern, lightweight, multi-tab plain-text editor for Windows, Linux, and macOS.**

TXT aims to replace the default text editors that come with modern operating systems.

> TXT is not designed to do everything. It is designed to do what everyone needs, exceptionally well.

---

## Introduction

TXT is a modern, lightweight, cross-platform plain-text editor designed for everyday text editing.

The idea behind TXT comes from a simple observation:

**System text editors are often too basic, while powerful editors are often too complex.**

For many everyday tasks, users do not need a full IDE, project management, extensions, terminals, or hundreds of configuration options.

They simply need a text editor that:

* Opens instantly
* Feels responsive
* Supports multiple documents
* Handles large files reliably
* Never gets in the way
* Works consistently across operating systems

TXT is designed to fill this gap.

### The Goal

TXT is not intended to become another VS Code.

It is not an IDE, development environment, or feature-heavy editor.

The goal is much simpler:

> **Build a better default text editor.**

TXT should feel like a natural part of the operating system rather than a large application that happens to edit text.

---

# Core Design Philosophy

## 1. Plain Text First

TXT is a **plain-text editor**.

No rich-text formatting, no unnecessary document features.

What you edit is text.

This simple principle should remain at the core of the project.

---

## 2. Lightweight

TXT should consume as few system resources as reasonably possible.

The application should:

* Start quickly
* Use minimal memory
* Have a small installation footprint
* Avoid unnecessary background processes
* Remain responsive on low-end hardware

Every dependency and feature should have a reason to exist.

---

## 3. Fast

TXT should feel instantaneous during normal use.

Opening, editing, switching tabs, searching, saving, and closing documents should all feel immediate.

Large files should not unnecessarily compromise the user experience.

Performance is not an optional feature.

**Performance is part of the product.**

---

## 4. Multi-Tab

Multiple documents should be easy to work with.

Tabs should provide a simple way to:

* Open multiple files
* Switch between documents
* Keep temporary documents
* Continue unfinished work

The interface should remain clean even with many open documents.

---

## 5. Reliable

A text editor should never make users worry about losing their work.

TXT should preserve unsaved sessions and provide automatic recovery after:

* Application crashes
* Unexpected shutdowns
* System restarts
* Accidental application closure

The user should be able to return to where they left off.

---

## 6. Secure

Temporary session data and cached content may contain sensitive information.

TXT should therefore treat local cached data as sensitive data.

Where appropriate, temporary documents and session information should be securely stored and encrypted.

Security should be built into the architecture rather than added later.

---

## 7. Simple

TXT should not become bloated simply because a feature is technically possible.

Every feature should answer one question:

> **Does this make text editing better?**

If not, it probably does not belong in TXT.

---

# Core Requirements

The initial development of TXT should focus on the following capabilities.

### Editing

* Plain-text editing
* Copy / paste
* Undo / redo
* Find / replace
* Line numbers
* Multiple selections where appropriate

### Tabs

* Multiple open documents
* Easy tab switching
* Reordering
* Closing and restoring tabs
* Unsaved state indication

### File Handling

* Open files
* Save files
* Save As
* Drag and drop
* File encoding detection
* Common text encodings

### Session Recovery

TXT should remember the user's working session.

If a document has not been saved to disk, TXT should be able to restore it when the application is opened again.

This is one of the key differences between TXT and traditional system text editors.

### Large Files

TXT should be designed to handle large text files efficiently.

The editor should remain responsive when working with files significantly larger than those normally handled by basic system editors.

### Cross-Platform

TXT should provide a consistent experience across:

* Windows
* Linux
* macOS

Platform-specific behavior should feel native where appropriate, while the core experience remains consistent.

---

# Technology

TXT is designed as a native, lightweight application rather than an Electron-based application.

### Planned Stack

| Component           | Technology              |
| ------------------- | ----------------------- |
| Language            | Rust                    |
| GUI                 | Slint                   |
| Text Buffer         | Rope-based architecture |
| Syntax Highlighting | syntect                 |
| Encoding            | encoding_rs             |
| Encryption          | AES-256-GCM             |
| Platform            | Windows / Linux / macOS |

### Why Rust?

Rust provides:

* Memory safety
* High performance
* Low runtime overhead
* Strong concurrency support
* Native binaries
* Excellent cross-platform capabilities

Rust is a natural fit for a lightweight system-level application.

### Why Not Electron?

TXT is intended to be a lightweight system text editor.

Using a browser runtime for such a simple application would introduce unnecessary overhead.

The goal is to stay as close to the operating system as practical.

---

# Project Principles

TXT follows several principles that should guide future development.

### Small over large

Prefer a small, focused application over a feature-heavy one.

### Native over abstraction

Prefer native system capabilities when they provide a better experience.

### Performance over features

A new feature should not come at the cost of making the core editor slower.

### Simplicity over configuration

Users should not need to configure dozens of options before TXT becomes useful.

### User experience over technical complexity

Technical sophistication is valuable only when it improves the user's experience.

### Open source over ownership

TXT is intended to remain free and open source.

The project should belong to its community rather than being locked to a single commercial interest.

---

# Roadmap

The roadmap will evolve with community feedback.

### Phase 1 — Foundation

* [ ] Cross-platform application
* [ ] Basic text editing
* [ ] File open / save
* [ ] Multi-tab interface
* [ ] Basic encoding support
* [ ] Session recovery

### Phase 2 — Performance & Reliability

* [ ] Large-file optimization
* [ ] Efficient text buffer
* [ ] Crash recovery
* [ ] Encrypted local cache
* [ ] Improved file handling

### Phase 3 — Advanced Editing

* [ ] Search and replace
* [ ] Syntax highlighting
* [ ] Command palette
* [ ] Keyboard shortcuts
* [ ] Customization

### Phase 4 — Community

* [ ] Community-driven improvements
* [ ] Documentation
* [ ] Plugin / extension discussion if justified
* [ ] Packaging for major platforms
* [ ] Distribution through major package managers

The roadmap is intentionally flexible.

**User needs should determine what TXT becomes.**

---

# Contributing

## We Need Developers

TXT is currently driven by a product vision focused on simplicity, performance, and user experience.

The project is looking for developers who are interested in building a genuinely useful open-source text editor.

You can contribute through:

* Code
* UI / UX
* Performance optimization
* Cross-platform development
* Security
* Testing
* Documentation
* Localization
* Product discussions
* Bug reports
* Feature proposals

You do not need to agree with every existing decision.

In fact, constructive disagreement is welcome.

The goal is not to build the editor according to one person's assumptions.

The goal is to build the editor that users actually need.

### For Developers

If you are interested in contributing, please start by reading the project discussions and open issues.

Before implementing a major feature, please open a discussion or issue first so the community can evaluate whether the feature fits TXT's design philosophy.

---

# Open Source

TXT is free and open-source software.

The project is released under the **MIT License**.

Contributions, forks, improvements, and redistribution are welcome.

The long-term vision is for TXT to become a widely adopted, community-driven text editor — potentially even becoming a default editor in future operating systems or distributions.

---

# Philosophy

TXT is built around a simple idea:

> **A text editor should not get in your way.**

Open it.

Write.

Save.

Close it.

And get back to your work.

That's TXT.
