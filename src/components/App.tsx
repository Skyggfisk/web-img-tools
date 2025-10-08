import { useState, useEffect } from "react";
import { parse } from "exifr";
import ColorThief from "colorthief";
import "~/styles/index.css";
import type { ActiveTool, ImageInfo } from "~/types/types";
import { BurgerMenu } from "./BurgerMenu";
import { ImageUpload } from "./ImageUpload";
import { ImagePreview } from "./ImagePreview";
import { Sidebar } from "./Sidebar";
import { ImageInfo as ImageInfoComponent } from "./ImageInfo";
import { ColorPalette } from "./ColorPalette";
import { Optimization } from "./Optimization";
import { FiltersEdit } from "./FiltersEdit";
import { ClearImageButton } from "./ClearImageButton";
import { ToolDrawer } from "./ToolDrawer";
import { TransformEdit } from "./TransformEdit";

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
  const [activeSection, setActiveSection] = useState<ActiveTool>("info");
  const [toolDrawerOpen, setToolDrawerOpen] = useState(false);
  const [hue, setHue] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(100);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [invert, setInvert] = useState<number>(0);
  const [blur, setBlur] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(100);
  const [manipulatedImage, setManipulatedImage] = useState<string | null>(null);
  const [comparisonSplitPosition, setComparisonSplitPosition] =
    useState<number>(50);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);

  const extractImageInfo = async (file: File) => {
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
        // Use higher quality (lower number = more pixels sampled) and extract more colors
        const colors = colorThief.getPalette(img, 32, 5); // Get up to 32 colors with quality 5
        setPalette(colors);
      } catch (error) {
        console.log("Error extracting palette:", error);
      }
    };
    img.src = URL.createObjectURL(file);

    setImageInfo(info);
  };

  const createManipulatedImage = () => {
    if (!selectedImage) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Set canvas dimensions based on user input or original dimensions
      const targetWidth = width > 0 ? width : img.naturalWidth;
      const targetHeight = height > 0 ? height : img.naturalHeight;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      if (ctx) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Reset any previous filters
        ctx.filter = "none";

        // Save the context state
        ctx.save();

        // Move to center for rotation
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Apply rotation
        ctx.rotate((rotation * Math.PI) / 180);

        // Apply scale
        ctx.scale(scale / 100, scale / 100);

        // Move back
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        // Apply CSS filters via canvas
        ctx.filter = `blur(${blur}px) hue-rotate(${hue}deg) saturate(${saturation}%) brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) invert(${invert}%)`;

        // Draw the image scaled to fit the target dimensions
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Restore context
        ctx.restore();

        // Convert to data URL
        const manipulatedDataUrl = canvas.toDataURL();
        setManipulatedImage(manipulatedDataUrl);
      }
    };

    img.src = selectedImage;
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

  // Create manipulated image when filters change
  useEffect(() => {
    if (selectedImage) {
      createManipulatedImage();
    }
  }, [
    selectedImage,
    hue,
    saturation,
    brightness,
    contrast,
    grayscale,
    invert,
    blur,
    rotation,
    scale,
    width,
    height,
  ]);

  return (
    <div className="h-screen w-screen relative overflow-x-hidden">
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
              selectedImage={selectedImage!}
              imageInfo={imageInfo}
              optimizedSize={optimizedSize}
            />
          )}

          {activeSection === "filters" && (
            <FiltersEdit
              hue={hue}
              setHue={setHue}
              saturation={saturation}
              setSaturation={setSaturation}
              brightness={brightness}
              setBrightness={setBrightness}
              contrast={contrast}
              setContrast={setContrast}
              grayscale={grayscale}
              setGrayscale={setGrayscale}
              invert={invert}
              setInvert={setInvert}
              blur={blur}
              setBlur={setBlur}
              onReset={() => {
                setHue(0);
                setSaturation(100);
                setBrightness(100);
                setContrast(100);
                setGrayscale(0);
                setInvert(0);
                setBlur(0);
              }}
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

      <div className="relative z-10">
        {/* Image preview section */}
        {selectedImage && (
          <>
            <ImagePreview
              originalSrc={selectedImage}
              manipulatedSrc={manipulatedImage || undefined}
              showComparison={
                manipulatedImage !== null &&
                (hue !== 0 ||
                  saturation !== 100 ||
                  brightness !== 100 ||
                  contrast !== 100 ||
                  grayscale !== 0 ||
                  invert !== 0 ||
                  blur !== 0 ||
                  rotation !== 0 ||
                  scale !== 100)
              }
              splitPosition={comparisonSplitPosition}
              onSplitPositionChange={setComparisonSplitPosition}
            />

            {/* Comparison Slider Handle - positioned over the image preview */}
            {manipulatedImage &&
              (hue !== 0 ||
                saturation !== 100 ||
                brightness !== 100 ||
                contrast !== 100 ||
                grayscale !== 0 ||
                invert !== 0 ||
                blur !== 0 ||
                rotation !== 0 ||
                scale !== 100) && (
                <>
                  {/* Split indicator bar - full height vertical line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-black/50 shadow-lg z-10"
                    style={{
                      left: `calc(50% + ${comparisonSplitPosition - 50}%)`,
                      transform: "translateX(-50%)",
                    }}
                  />

                  {/* Slider handle */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 shadow-xl rounded-full cursor-ew-resize z-20 flex items-center justify-center "
                    style={{
                      left: `calc(50% + ${comparisonSplitPosition - 50}%)`,
                      transform: "translateX(-50%) translateY(-50%)",
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const startX = e.clientX;
                      const startPosition = comparisonSplitPosition;

                      const handleMouseMove = (e: MouseEvent) => {
                        const deltaX = e.clientX - startX;
                        const containerWidth = window.innerWidth;
                        const deltaPercent = (deltaX / containerWidth) * 100;
                        const newPosition = Math.max(
                          0,
                          Math.min(100, startPosition + deltaPercent)
                        );
                        setComparisonSplitPosition(newPosition);
                      };

                      const handleMouseUp = () => {
                        document.removeEventListener(
                          "mousemove",
                          handleMouseMove
                        );
                        document.removeEventListener("mouseup", handleMouseUp);
                      };

                      document.addEventListener("mousemove", handleMouseMove);
                      document.addEventListener("mouseup", handleMouseUp);
                    }}
                  >
                    <span className="text-white text-xl font-bold select-none">
                      {"< >"}
                    </span>
                  </div>
                </>
              )}
          </>
        )}{" "}
        <div className="max-w-7xl mx-auto text-center">
          {/* Title and upload image area section */}
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
        </div>
      </div>
    </div>
  );
}

export default App;
