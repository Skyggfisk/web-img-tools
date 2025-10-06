import { useState } from "react";
import { parse } from "exifr";
import ColorThief from "colorthief";
import "~/styles/index.css";

interface ImageInfo {
  fileSize: number;
  dimensions: { width: number; height: number } | null;
  lastModified: Date | null;
  exif: any;
}

export function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [palette, setPalette] = useState<number[][] | null>(null);
  const [convertFormat, setConvertFormat] = useState<string>("png");
  const [isDragOver, setIsDragOver] = useState(false);

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
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
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

  const formatFileSize = (bytes: number) => {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const handleDownload = () => {
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
            const a = document.createElement("a");
            a.href = url;
            a.download = `converted.${convertFormat}`;
            a.click();
            URL.revokeObjectURL(url);
          }
        },
        `image/${convertFormat}`,
        convertFormat === "jpeg" ? 0.9 : undefined
      );
    };

    img.src = selectedImage;
  };

  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      <h1 className="text-5xl font-bold my-4 leading-tight">Web Image Tools</h1>
      <p className="mb-8">
        Upload or drag and drop an image to preview and analyze it.
      </p>

      <div
        className={`border-2 border-dashed rounded-lg p-8 mb-4 transition-colors ${
          isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <div className="text-gray-600">
            <p className="text-lg font-semibold">Click to select an image</p>
            <p>or drag and drop here</p>
          </div>
        </label>
      </div>

      {selectedImage && (
        <div className="mt-4">
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-96 border rounded shadow mx-auto"
          />
        </div>
      )}

      {imageInfo && (
        <div className="mt-8 text-left max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Image Information</h2>
          <div className="space-y-2">
            <p>
              <strong>File Size:</strong> {formatFileSize(imageInfo.fileSize)}
            </p>
            {imageInfo.dimensions && (
              <p>
                <strong>Dimensions:</strong> {imageInfo.dimensions.width} x{" "}
                {imageInfo.dimensions.height} pixels
              </p>
            )}
            {imageInfo.lastModified && (
              <p>
                <strong>Last Modified:</strong>{" "}
                {imageInfo.lastModified.toLocaleString()}
              </p>
            )}
          </div>

          {imageInfo.exif && Object.keys(imageInfo.exif).length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer font-semibold">
                Advanced EXIF Data
              </summary>
              <div className="mt-2 p-4 rounded">
                <pre className="text-sm bg-neutral-700 overflow-x-hidden">
                  {JSON.stringify(imageInfo.exif, null, 2)}
                </pre>
              </div>
            </details>
          )}
        </div>
      )}

      {palette && (
        <div className="mt-8 text-left max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Color Palette</h2>
          <div className="flex flex-wrap gap-2">
            {palette.map((color, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded border"
                style={{
                  backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                }}
                title={`RGB(${color[0]}, ${color[1]}, ${color[2]})`}
              ></div>
            ))}
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="mt-8 text-left max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Convert & Download</h2>
          <div className="flex gap-4 items-center">
            <label htmlFor="format-select" className="font-medium">
              Format:
            </label>
            <select
              id="format-select"
              value={convertFormat}
              onChange={(e) => setConvertFormat(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="png" className="text-black">
                PNG
              </option>
              <option value="jpeg" className="text-black">
                JPEG
              </option>
              <option value="webp" className="text-black">
                WebP
              </option>
            </select>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
