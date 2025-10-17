# Web Image Tools

A fully client-side image manipulation and analysis web application built with modern web technologies. Upload, analyze, optimize, and edit images directly in your browser.

> [!WARNING]
> This project is still very much under construction and barely any of the features work as described yet. You are free to play around and preview, but don't expect actual optimization or great filters.

## ✨ Features

- **📤 Image Upload & Preview** - Drag & drop or click to upload images with full-screen preview
- **🔍 Image Analysis** - Extract and display EXIF metadata, dimensions, and file information
- **🎨 Color Palette Extraction** - Automatically generate color palettes from images
- **⚡ Image Optimization** - Convert formats (PNG, JPEG, WebP) and adjust compression
- **🎛️ Advanced Filters** - Real-time image editing with hue, saturation, brightness, contrast controls
- **🔎 Interactive Zoom & Pan** - Mouse wheel zoom and drag-to-pan functionality

## 🔒 Privacy & Security

**Fully Static & Local** - This application runs entirely in your browser with zero server communication. Your images never leave your device, ensuring complete privacy and security. No data is sent to external servers.

## 🏗️ Tech Stack

### Core Technologies

- **Runtime+Bundler**: [Bun](https://bun.com) - Fast all-in-one JavaScript runtime and build tool
- **Frontend**: [React](https://react.dev/) - With TypeScript for type-safe component development
- **Styling**: [TailwindCSS](https://tailwindcss.com/) - For utility-first responsive design

### Key Libraries

- **[PixiJS](https://pixijs.com/)** - flexible 2D webGL renderer
- **[exifr](https://github.com/MikeKovarik/exifr)** - EXIF metadata extraction from images
- **[colorthief](https://lokeshdhakar.com/projects/color-thief/)** - Dominant color palette generation

## 🚀 Setup & Installation

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- Modern web browser with [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) and at least [webGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) support

### Quick Start and Development Commands

```bash
# Clone the repository
git clone https://github.com/Skyggfisk/web-img-tools.git
cd web-img-tools

# Install dependencies
bun install

# Start development server with hot reload, defaults to localhost:3000
bun dev

# Build for production
bun run build

# Preview production build
bun run preview

# Run type checking
bun run type-check
```

### Using Dev Containers (VS Code)

This project includes dev container configuration for a consistent development environment:

1. **Prerequisites**: [VS Code](https://code.visualstudio.com/) with [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

2. **Open in Dev Container**:

   - Open the project in VS Code
   - When prompted, click "Reopen in Container" or use Command Palette: `Dev Containers: Reopen in Container`
   - The container will build automatically with all dependencies pre-installed

3. **Development Workflow**:
   ```bash
   # The dev container includes Bun and all dependencies
   bun dev  # Start development server
   bun run build  # Build for production
   ```

## 🎯 Usage

1. **Upload an Image**: Drag & drop or click the upload area
2. **Navigate Tools**: Use the sidebar menu to select different tools
3. **View Information**: Check EXIF data, dimensions, and file details
4. **Extract Colors**: Generate color palettes from your images
5. **Optimize**: Convert formats and adjust compression settings
6. **Edit**: Apply filters, rotate, and scale your images
7. **Zoom & Pan**: Use mouse wheel and drag to explore images
