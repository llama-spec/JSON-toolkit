# API Debug Toolkit 🛠️

A fast, privacy-first, client-side developer toolkit for API & JSON workflows.
Built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 🚀 Features

### **Core Tools**
-   **JSON Formatter & Validator**: Pretty print, minify, and validate JSON with line-specific errors.
-   **JSON Diff Tool**: Visual comparison of two JSON objects to spot changes instantly.
-   **Smart Analyzer**: Detect potential issues like deep nesting, float precision loss, and inconsistent types.
-   **Converters**:
    -   **JSON to TypeScript**: Generate Interfaces, Zod Schemas, and Pydantic Models.
    -   **JSON <-> CSV**: Bi-directional conversion.
    -   **JSON <-> XML**: Bi-directional conversion.
    -   **JSON <-> YAML**: Bi-directional conversion.

### **Performance & Design**
-   **⚡ Blazing Fast**: 
    -   **Web Worker Offloading**: Heavy JSON parsing and tree flattening runs in a background thread, keeping the UI responsive even with 50MB+ files.
    -   **Virtualization**: Uses `react-window` to render massive trees (50k+ nodes) instantly.
    -   **Compact Data Structures**: Optimized internal data transfer for minimal overhead.
-   **🎨 Monochrome Theme**: A professional, high-contrast dark mode designed for developer focus (Black/White/Dark Gray with Electric Blue accents).
-   **🔒 Privacy First**: All processing happens **client-side**. No data is ever sent to any server.

## 🛠 Tech Stack

-   **Framework**: Next.js (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS (v4) + CSS Variables
-   **State Management**: React Hooks + Web Workers
-   **Editor**: Monaco Editor (`@monaco-editor/react`)
-   **Icons**: Lucide React
-   **Theming**: `next-themes` (Dark/Light mode)

## 📦 Getting Started

1.  **Clone the repo**
    ```bash
    git clone https://github.com/llama-spec/JSON-toolkit.git
    cd JSON-toolkit
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    npm start
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for Developers.
