# 🖼️ Rust + WASM Photo Editor

A high-performance, in-browser photo editing application powered by **Rust** and **WebAssembly**.

This project demonstrates the power of offloading CPU-intensive image processing tasks from JavaScript to Rust, ensuring a smooth and responsive user interface even when performing complex convolution filters on large images.

---

## ✨ Features

- **� High Performance**: Image processing logic written in Rust and compiled to WebAssembly (WASM) for near-native speed.
- **🧵 Non-Blocking UI**: All heavy lifting happens in a **Web Worker**, keeping the main thread free for UI interactions.
- **🛠️ Real-Time Adjustments**:
  - Brightness & Contrast sliders
  - **Presets**: Vintage, Vivid, Noir
  - **Filters**: Box Blur, Sharpen (Convolution Kernels)
- **🎨 Canvas Operations**:
  - Rotate (90° clockwise)
  - Resize (50% scale)
- **↩️ History Management**: Full Undo/Redo support.
- **📦 Zero Backend**: Works entirely client-side. No images are uploaded to any server.

---

## 🏗️ Architecture

The application uses a hybrid approach to maximize performance and usability:

```mermaid
graph TD;
    UI[User Interface (HTML/CSS)] -->|Events & Data| JS[Main Thread (JavaScript)];
    JS -->|Message Passing| Worker[Web Worker];
    Worker -->|WASM Calls| Rust[Rust Core (WASM)];
    Rust -->|Processed Pixels| Worker;
    Worker -->|Result| JS;
    JS -->|Render| Canvas[HTML5 Canvas];
```

### Key Design Decisions
- **Stateless WASM**: The Rust side is a pure function pipeline. It takes pixel data, applies a transformation, and returns the result. It does not manage application state.
- **Shared Memory / Zero Copy**: (Conceptually) we aim to minimize data copying between JS and WASM, though this demo uses standard message passing with TypedArrays.
- **Web Workers**: Essential for preventing the "main thread freeze" during heavy computation.

---

## 🛠️ Tech Stack

- **Core Logic**: [Rust](https://www.rust-lang.org/)
- **Compilation**: [WebAssembly (WASM)](https://webassembly.org/)
- **Bindings**: [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Bootstrap 5
- **Tooling**: [wasm-pack](https://rustwasm.github.io/wasm-pack/)

---

## � Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

Ensure you have the following installed:

1.  **Rust Toolchain**:
    ```bash
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```
2.  **wasm-pack**:
    ```bash
    cargo install wasm-pack
    ```
3.  **Local Web Server**:
    Any static file server will do. Examples:
    - `npm install -g serve`
    - Let's use Python (built-in usually): `python3 -m http.server`

### Installation & Build

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/rust-wasm-photo-editor.git
    cd rust-wasm-photo-editor
    ```

2.  **Build the WebAssembly module**:
    This compiles the Rust code into `pkg/` folder which JS can import.
    ```bash
    wasm-pack build --release --target web
    ```

3.  **Run the local server**:
    ```bash
    # Using python
    python3 -m http.server 3000
    
    # OR using serve
    serve .
    ```

4.  **Open in Browser**:
    Navigate to `http://localhost:3000`.

    > **Note**: You strictly **cannot** open `index.html` directly from the file system (file://) because web workers and WASM modules require HTTP/HTTPS to function due to CORS and module security policies.

---

## 🧪 Development Workflow

To make changes to the Rust code:

1.  Edit `src/lib.rs`.
2.  Rebuild: `wasm-pack build --release --target web`
3.  Refresh the browser.

To make changes to the UI (`index.html`, `styles.css`, `main.js`), just save and refresh.

### SIMD Support (Optional)

If your environment supports **WebAssembly SIMD**, you can enable parallelized pixel processing (check `brightness_simd` in code) for even greater speed:

```bash
RUSTFLAGS="-C target-feature=+simd128" wasm-pack build --release --target web
```

---

## 📂 Project Structure

```text
rust-wasm-photo-editor/
├── Cargo.toml          # Rust dependencies and config
├── src/
│   └── lib.rs          # Main Rust source code (Image processing logic)
├── pkg/                # Generated WASM binding files (do not edit)
├── index.html          # Main UI
├── main.js             # UI Logic & Event Listeners
├── worker.js           # Web Worker entry point
├── styles.css          # App styling
└── README.md           # This file
```

---

## 🤝 Contributing

Contributions are welcome!

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📝 License

This project is open source and available under the MIT License.