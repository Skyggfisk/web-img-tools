# Web Image Tools

A comprehensive client-side image manipulation and analysis web application built with modern web technologies. Upload, analyze, optimize, and edit images directly in your browser with professional-grade tools.

## ✨ Features

- **📤 Image Upload & Preview** - Drag & drop or click to upload images with full-screen preview
- **🔍 Image Analysis** - Extract and display EXIF metadata, dimensions, and file information
- **🎨 Color Palette Extraction** - Automatically generate color palettes from images
- **⚡ Image Optimization** - Convert formats (PNG, JPEG, WebP) and adjust compression
- **🎛️ Advanced Filters** - Real-time image editing with hue, saturation, brightness, contrast controls
- **🔄 Transform Tools** - Rotate and scale images with smooth controls
- **🔎 Interactive Zoom & Pan** - Mouse wheel zoom and drag-to-pan functionality
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices
- **🎯 Professional UI** - Clean, intuitive interface with tool drawers and navigation

## 🔒 Privacy & Security

**Fully Static & Local** - This application runs entirely in your browser with zero server communication. Your images never leave your device, ensuring complete privacy and security. No data is sent to external servers.

## 🏗️ Architecture & Tech Stack

### Core Technologies

- **Runtime**: [Bun](https://bun.com) - Fast all-in-one JavaScript runtime and build tool
- **Frontend**: React 18 with TypeScript for type-safe component development
- **Styling**: Tailwind CSS for utility-first responsive design
- **Build System**: Bun's built-in bundler for optimized production builds

### Key Libraries

- **exifr** - EXIF metadata extraction from images
- **colorthief** - Dominant color palette generation
- **React Hooks** - State management and side effects
- **Canvas API** - Client-side image processing and manipulation

### Architecture Highlights

- **Component-Based**: Modular React components for maintainability
- **Client-Side Processing**: All image operations performed locally in the browser
- **Responsive Layout**: Mobile-first design with adaptive UI elements
- **Performance Optimized**: Efficient rendering and memory management for large images

## 🚀 Setup & Installation

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- Modern web browser with Canvas API support

### Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd web-img-tools
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Start development server**

   ```bash
   bun dev
   ```

4. **Open your browser** to `http://localhost:3000`

### Development Commands

```bash
# Install dependencies
bun install

# Start development server with hot reload
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

### Manual Setup (Without Dev Containers)

If you prefer not to use dev containers:

1. **Install Bun**:

   ```bash
   # macOS/Linux
   curl -fsSL https://bun.sh/install | bash

   # Windows
   powershell -c "irm bun.sh/install.ps1 | iex"
   ```

2. **Install Dependencies**:

   ```bash
   bun install
   ```

3. **Start Development**:
   ```bash
   bun dev
   ```

## 📁 Project Structure

```
web-img-tools/
├── src/
│   ├── components/          # React components
│   │   ├── App.tsx         # Main application component
│   │   ├── ImagePreview.tsx # Full-screen image viewer
│   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   └── ...             # Other feature components
│   ├── styles/
│   │   └── index.css       # Global styles and Tailwind imports
│   ├── types/
│   │   └── types.ts        # TypeScript type definitions
│   └── utils/
│       └── imageUtils.ts   # Image processing utilities
├── public/                  # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🎯 Usage

1. **Upload an Image**: Drag & drop or click the upload area
2. **Navigate Tools**: Use the sidebar menu to select different tools
3. **View Information**: Check EXIF data, dimensions, and file details
4. **Extract Colors**: Generate color palettes from your images
5. **Optimize**: Convert formats and adjust compression settings
6. **Edit**: Apply filters, rotate, and scale your images
7. **Zoom & Pan**: Use mouse wheel and drag to explore images

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Bun, React, and Tailwind CSS
