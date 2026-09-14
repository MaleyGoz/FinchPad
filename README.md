<div align="center">

<img src="assets/logo.png" width="120">

<h1>TXT</h1>

<p>
  <strong>A modern, lightweight, multi-tab plain-text editor for Windows, Linux, and macOS.</strong>
</p>

<p>
  TXT aims to become a better default text editor.
</p>

<p>
  <a href="README.md">English</a>
  &nbsp;·&nbsp;
  <a href="README.zh-CN.md">简体中文</a>
</p>

</div>

<br>

<div align="center">

> <strong>Find the common needs of ordinary users,<br>
> and do them exceptionally well.</strong>

</div>

TXT is not designed to do everything.

It is designed to do **what most people need** — without unnecessary features, complexity, or resource consumption.

---

<h2>Why TXT?</h2>

<p>
Today's default text editors generally fall into two directions:
</p>

<table>
<tr>
<td width="50%" valign="top">

### Too Basic

Limited editing capabilities and poor handling of larger or more demanding tasks.

</td>
<td width="50%" valign="top">

### Too Complex

Powerful editors and IDEs provide far more functionality than ordinary users need.

</td>
</tr>
</table>

<br>

<div align="center">

<strong>TXT aims to find the common ground.</strong>

<br><br>

More capable than a basic system editor.<br>
Simpler and lighter than a development environment.

</div>

<br>

The goal is not to build another feature-heavy editor.

The goal is to build a text editor that could eventually be good enough to become a **default editor for an operating system**.

---

<h2>Core Design</h2>

<table>
<tr>
<td width="50%" valign="top">

<h3>01 · Plain Text Only</h3>

TXT is a <strong>plain-text editor</strong>.

Pasted rich text is automatically converted to plain text.

No RTF. No HTML formatting. No unnecessary document features.

</td>
<td width="50%" valign="top">

<h3>02 · Lightweight & Native</h3>

Fast startup, low resource usage, and a small footprint.

<strong>No Electron.</strong>

The project favors native, lightweight technologies wherever practical.

</td>
</tr>

<tr>
<td width="50%" valign="top">

<h3>03 · Minimal Multi-Tab</h3>

Multiple documents, one simple interface.

No traditional menu bar.

Features remain accessible through contextual menus, the command palette, and a minimal toolbar.

</td>
<td width="50%" valign="top">

<h3>04 · Never Lose Your Work</h3>

Unsaved documents are silently preserved in an encrypted local cache and restored when TXT is opened again.

The user should not have to think about recovery.

</td>
</tr>

<tr>
<td width="50%" valign="top">

<h3>05 · Large Files</h3>

TXT is designed for efficient editing of large text files.

A rope-based text buffer helps maintain responsive editing performance while minimizing unnecessary data copying.

</td>
<td width="50%" valign="top">

<h3>06 · Secure by Default</h3>

Session data and temporary documents may contain sensitive information.

Local caches are encrypted and protected using the operating system's secure storage where available.

</td>
</tr>
</table>

---

<h2>Technology</h2>

<table>
<thead>
<tr>
<th align="left">Component</th>
<th align="left">Technology</th>
</tr>
</thead>
<tbody>
<tr>
<td>Language</td>
<td>Rust</td>
</tr>
<tr>
<td>GUI</td>
<td>Slint</td>
</tr>
<tr>
<td>Text Buffer</td>
<td>Rope</td>
</tr>
<tr>
<td>Syntax Highlighting</td>
<td>syntect</td>
</tr>
<tr>
<td>Encoding</td>
<td>encoding_rs</td>
</tr>
<tr>
<td>Encryption</td>
<td>AES-256-GCM</td>
</tr>
<tr>
<td>Platforms</td>
<td>Windows · Linux · macOS</td>
</tr>
</tbody>
</table>

<p>
TXT intentionally avoids Electron in favor of a lightweight native architecture.
</p>

---

<h2>Product Principle</h2>

<div align="center">

<h3>Maximum common ground.<br>
Minimum unnecessary features.</h3>

</div>

<p>
Every feature should be evaluated by one question:
</p>

<div align="center">

<strong>Do most users actually need this?</strong>

</div>

<p>
If not, it probably does not belong in TXT.
</p>

---

<h2>Roadmap</h2>

<p>
The roadmap will be driven by real user needs and community discussion.
</p>

<table>
<tr>
<td>☐</td>
<td>Core text editing</td>
</tr>
<tr>
<td>☐</td>
<td>Multi-tab editing</td>
</tr>
<tr>
<td>☐</td>
<td>Cross-platform support</td>
</tr>
<tr>
<td>☐</td>
<td>Session recovery</td>
</tr>
<tr>
<td>☐</td>
<td>Large-file performance</td>
</tr>
<tr>
<td>☐</td>
<td>Encoding support</td>
</tr>
<tr>
<td>☐</td>
<td>Encrypted cache</td>
</tr>
<tr>
<td>☐</td>
<td>Syntax highlighting</td>
</tr>
<tr>
<td>☐</td>
<td>Packaging & distribution</td>
</tr>
</table>

---

<h2>Contributing</h2>

<p>
<strong>TXT is looking for developers, designers, testers, and anyone interested in building a better everyday text editor.</strong>
</p>

<p>Contributions are welcome in:</p>

<table>
<tr>
<td>Code</td>
<td>UI / UX</td>
<td>Performance</td>
</tr>
<tr>
<td>Security</td>
<td>Testing</td>
<td>Documentation</td>
</tr>
<tr>
<td>Localization</td>
<td>Product discussions</td>
<td>Bug reports</td>
</tr>
</table>

<p>
You don't have to be a developer to contribute.
</p>

<p>
The product direction is intentionally open to discussion.
</p>

<div align="center">

<strong>If you believe everyday text editors can be simpler, faster, and better, you're welcome to join.</strong>

</div>

---

<h2>License</h2>

<p>
TXT is free and open-source software released under the
<strong>MIT License</strong>.
</p>

<p>
Contributions, forks, and redistribution are welcome.
</p>

<br>

<div align="center">

<strong>TXT</strong><br> <sub>A better default text editor.</sub>

</div>
