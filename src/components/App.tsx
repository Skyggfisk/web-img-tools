import { useState } from "react";
import { parse } from "exifr";
import ColorThief from "colorthief";
import "~/styles/index.css";
import type { ImageInfo } from "~/types/types";
import { BurgerMenu } from "./BurgerMenu";
import { ImageUpload } from "./ImageUpload";
import { ImagePreview } from "./ImagePreview";
import { Sidebar } from "./Sidebar";
import { ImageInfo as ImageInfoComponent } from "./ImageInfo";
import { ColorPalette } from "./ColorPalette";
import { Optimization } from "./Optimization";
import { FiltersEdit } from "./FiltersEdit";
import { ClearImageButton } from "./ClearImageButton";

export function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [palette, setPalette] = useState<number[][] | null>(null);
  const [convertFormat, setConvertFormat] = useState<string>("png");
  const [compressionValue, setCompressionValue] = useState<number>(0.8);
  const [optimizedImage, setOptimizedImage] = useState<string | null>(null);
  const [optimizedSize, setOptimizedSize] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("info");
  const [hue, setHue] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(100);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(100);

  const extractImageInfo = async (file: File) => {
    const info: ImageInfo = {
      fileSize: file.size,
      dimensions: null,
      lastModified: new Date(file.lastModified),
      exif: null,
    };

    // Extract EXIF
    try {
      info.exif = await parse(file);
    } catch (error) {
      console.log("No EXIF data or error parsing:", error);
    }

    // Extract dimensions and palette
    const img = new Image();
    img.onload = () => {
      info.dimensions = { width: img.naturalWidth, height: img.naturalHeight };
      setImageInfo({ ...info });

      // Extract palette
      const colorThief = new ColorThief();
      try {
        const colors = colorThief.getPalette(img, 8); // Get 8 colors
        setPalette(colors);
      } catch (error) {
        console.log("Error extracting palette:", error);
      }
    };
    img.src = URL.createObjectURL(file);

    setImageInfo(info);
  };

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setOptimizedImage(null);
      setOptimizedSize(null);
      extractImageInfo(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleOptimize = () => {
    if (!selectedImage) return;

    const canvas = document.createElement("canvas");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setOptimizedImage(url);
            setOptimizedSize(blob.size);
          }
        },
        `image/${convertFormat}`,
        compressionValue
      );
    };

    img.src = selectedImage;
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImageInfo(null);
    setPalette(null);
    setOptimizedImage(null);
    setOptimizedSize(null);
    setHue(0);
    setSaturation(100);
    setBrightness(100);
    setContrast(100);
    setRotation(0);
    setScale(100);
  };

  const handleDownload = () => {
    const imageToDownload = optimizedImage || selectedImage;
    if (!imageToDownload) return;

    const canvas = document.createElement("canvas");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `optimized.${convertFormat}`;
            a.click();
            URL.revokeObjectURL(url);
          }
        },
        `image/${convertFormat}`,
        convertFormat === "png" ? undefined : compressionValue
      );
    };

    img.src = imageToDownload;
  };

  return (
    <div className="min-h-screen relative">
      {/* Menu section */}
      <BurgerMenu
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {selectedImage && <ClearImageButton clearImage={clearImage} />}

      <Sidebar
        isOpen={sidebarOpen}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Title and upload image area section */}
      <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
        {!selectedImage && (
          <>
            <h1 className="text-5xl font-bold my-4 leading-tight">
              Web Image Tools
            </h1>
            <p className="mb-8">
              Upload or drag and drop an image to preview and analyze it.
            </p>
          </>
        )}

        {!selectedImage && (
          <ImageUpload
            isDragOver={isDragOver}
            onFileChange={handleFileChange}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          />
        )}

        {/* Image preview section */}
        {selectedImage && <ImagePreview src={selectedImage} />}

        {/* Conditional tools section */}
        {selectedImage && activeSection === "info" && imageInfo && (
          <ImageInfoComponent imageInfo={imageInfo} />
        )}

        {selectedImage && activeSection === "palette" && palette && (
          <ColorPalette palette={palette} />
        )}

        {selectedImage && activeSection === "optimization" && (
          <Optimization
            convertFormat={convertFormat}
            setConvertFormat={setConvertFormat}
            compressionValue={compressionValue}
            setCompressionValue={setCompressionValue}
            onOptimize={handleOptimize}
            onDownload={handleDownload}
            optimizedImage={optimizedImage}
            selectedImage={selectedImage}
            imageInfo={imageInfo}
            optimizedSize={optimizedSize}
          />
        )}

        {selectedImage && activeSection === "filters" && (
          <FiltersEdit
            hue={hue}
            setHue={setHue}
            saturation={saturation}
            setSaturation={setSaturation}
            brightness={brightness}
            setBrightness={setBrightness}
            contrast={contrast}
            setContrast={setContrast}
            rotation={rotation}
            setRotation={setRotation}
            scale={scale}
            setScale={setScale}
            selectedImage={selectedImage}
            onReset={() => {
              setHue(0);
              setSaturation(100);
              setBrightness(100);
              setContrast(100);
              setRotation(0);
              setScale(100);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
