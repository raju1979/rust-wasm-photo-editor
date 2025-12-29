# 🖼️ Mini Photo Editor — Rust + WebAssembly

A high-performance, browser-based photo editor built using **Rust compiled to WebAssembly (WASM)**.  
The application demonstrates how CPU-intensive image processing can be offloaded from JavaScript to Rust while keeping the UI fully responsive using **Web Workers**.

🌐 Live Demo: https://knowledge.ajarafashion.com/

---

## ✨ Features

- 📷 Upload and edit images directly in the browser
- 🎚️ Real-time filters: Brightness, Contrast
- 🎨 Presets: Vintage, Vivid, Noir
- 🧮 Blur & Sharpen using convolution kernels
- ↩️ Undo / Redo with immutable image snapshots
- 🔄 Rotate and resize images
- ⚡ High-performance image processing using Rust + WASM
- 🧵 Web Workers for non-blocking UI
- 📦 Fully static — no backend required

---

## 🧠 Why Rust + WebAssembly?

JavaScript struggles with large, CPU-heavy loops such as image processing and convolution filters.  
Rust, compiled to WebAssembly, provides:

- Near-native performance
- Predictable memory usage
- Strong type safety
- Secure sandboxed execution in the browser

By combining Rust WASM with Web Workers, this app achieves **high performance without freezing the UI**.

---

## 🏗️ Architecture Overview

