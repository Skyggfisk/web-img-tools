import { useState } from "react";
import { parse } from "exifr";
import ColorThief from "colorthief";
import "~/styles/index.css";
import type { ActiveTool, ImageInfo } from "~/types/types";
import { BurgerMenu } from "./BurgerMenu";
import { ImageUpload } from "./ImageUpload";
import { Sidebar } from "./Sidebar";
import { ImageInfo as ImageInfoComponent } from "./ImageInfo";
import { ColorPalette } from "./ColorPalette";
import { Optimization } from "./Optimization";
import { FiltersEdit } from "./FiltersEdit";
import { ClearImageButton } from "./ClearImageButton";
import { ToolDrawer } from "./ToolDrawer";
import { TransformEdit } from "./TransformEdit";
import { LoadingSpinner } from "./LoadingSpinner";
import { ImagePreview } from "./ImagePreview";
import type { EditHistory, Layer, WorkingLayer } from "~/types/filters";

export function App() {
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [palette, setPalette] = useState<number[][] | null>(null);
  const [convertFormat, setConvertFormat] = useState<string>("png");
  const [compressionValue, setCompressionValue] = useState<number>(0.8);
  const [optimizedImage, setOptimizedImage] = useState<string | null>(null);
  const [optimizedSize, setOptimizedSize] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveTool>("info");
  const [toolDrawerOpen, setToolDrawerOpen] = useState(false);
  const [scale, setScale] = useState<number>(100);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);
  // Layer and history state
  const [layers, setLayers] = useState<Layer[]>([]);
  const [history, setHistory] = useState<EditHistory>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);
  const [workingLayer, setWorkingLayer] = useState<WorkingLayer>({
    hue: 0,
    saturation: 100,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    invert: 0,
    blur: 0,
  });

  const extractImageInfo = async (file: File) => {
    setIsLoadingImage(true);

    const info: ImageInfo = {
      fileSize: file.size,
      dimensions: null,
      lastModified: new Date(file.lastModified),
      exif: null,
      format: file.type.split("/")[1] || "unknown",
      name: file.name,
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

      // Set initial dimensions for the filters
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);

      // Extract palette
      const colorThief = new ColorThief();
      try {
        const colors = colorThief.getPalette(img, 32, 5);
        setPalette(colors);
      } catch (error) {
        console.log("Error extracting palette:", error);
      }
      setIsLoadingImage(false);
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
    setScale(100);
    setWidth(0);
    setHeight(0);
    setKeepAspectRatio(true);
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

  const applyLayers = () => {
    const currentState = {
      ...workingLayer,
    };
    setHistory([...history.slice(0, currentHistoryIndex + 1), currentState]);
    setCurrentHistoryIndex(currentHistoryIndex + 1);

    // Add current filters as a new layer
    const newLayer = {
      type: "committed",
      values: currentState,
    };
    setLayers([...layers, newLayer]);

    // Reset working layer
    setWorkingLayer({
      hue: 0,
      saturation: 100,
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      invert: 0,
      blur: 0,
    });
  };

  const resetAllFilters = () => {
    setLayers([]);
    setHistory([]);
    setCurrentHistoryIndex(-1);
    setWorkingLayer({
      hue: 0,
      saturation: 100,
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      invert: 0,
      blur: 0,
    });
  };

  return (
    <div className="h-dvh w-screen relative overflow-x-hidden">
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
      {/* Tool Drawer */}
      {selectedImage && (
        <ToolDrawer
          toolDrawerOpen={toolDrawerOpen}
          setToolDrawerOpen={setToolDrawerOpen}
          activeSection={activeSection}
        >
          {/* Conditional tools content */}
          {activeSection === "info" && imageInfo && (
            <ImageInfoComponent imageInfo={imageInfo} />
          )}

          {activeSection === "palette" && palette && (
            <ColorPalette palette={palette} />
          )}

          {activeSection === "optimization" && (
            <Optimization
              convertFormat={convertFormat}
              setConvertFormat={setConvertFormat}
              compressionValue={compressionValue}
              setCompressionValue={setCompressionValue}
              onOptimize={handleOptimize}
              onDownload={handleDownload}
              optimizedImage={optimizedImage}
              imageInfo={imageInfo}
              optimizedSize={optimizedSize}
            />
          )}

          {activeSection === "filters" && (
            <FiltersEdit
              layers={layers}
              setLayers={setLayers}
              history={history}
              currentHistoryIndex={currentHistoryIndex}
              setCurrentHistoryIndex={setCurrentHistoryIndex}
              onApply={applyLayers}
              onResetAllFilters={resetAllFilters}
              workingLayer={workingLayer}
              setWorkingLayer={setWorkingLayer}
            />
          )}

          {activeSection === "transform" && (
            <TransformEdit
              scale={scale}
              setScale={setScale}
              width={width}
              setWidth={setWidth}
              height={height}
              setHeight={setHeight}
              keepAspectRatio={keepAspectRatio}
              setKeepAspectRatio={setKeepAspectRatio}
              originalWidth={imageInfo?.dimensions?.width || 0}
              originalHeight={imageInfo?.dimensions?.height || 0}
              onReset={() => {
                setScale(100);
                setWidth(imageInfo?.dimensions?.width || 0);
                setHeight(imageInfo?.dimensions?.height || 0);
                setKeepAspectRatio(true);
              }}
            />
          )}
        </ToolDrawer>
      )}
      {/* Title and upload image section */}
      {!selectedImage && (
        <ImageUpload
          isDragOver={isDragOver}
          onFileChange={handleFileChange}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        />
      )}
      {/* Loader */}
      {selectedImage && isLoadingImage && (
        <LoadingSpinner message="Loading image..." />
      )}
      {/* Image preview section */}
      {selectedImage && !isLoadingImage && (
        <ImagePreview
          imageSrc={selectedImage}
          showComparison={
            layers.length > 0 ||
            workingLayer.hue !== 0 ||
            workingLayer.saturation !== 100 ||
            workingLayer.brightness !== 100 ||
            workingLayer.contrast !== 100 ||
            workingLayer.grayscale !== 0 ||
            workingLayer.invert !== 0 ||
            workingLayer.blur !== 0
          }
          width={width}
          height={height}
          layers={layers}
          workingLayer={workingLayer}
        />
      )}
    </div>
  );
}

export default App;
