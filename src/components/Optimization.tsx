import type { ImageInfo } from "../types/types";
import { formatFileSize } from "../utils/imageUtils";

interface OptimizationProps {
  convertFormat: string;
  setConvertFormat: (format: string) => void;
  compressionValue: number;
  setCompressionValue: (value: number) => void;
  onOptimize: () => void;
  onDownload: () => void;
  optimizedImage: string | null;
  selectedImage: string;
  imageInfo: ImageInfo | null;
  optimizedSize: number | null;
}

export function Optimization({
  convertFormat,
  setConvertFormat,
  compressionValue,
  setCompressionValue,
  onOptimize,
  onDownload,
  optimizedImage,
  selectedImage,
  imageInfo,
  optimizedSize,
}: OptimizationProps) {
  return (
    <>
      <div className="text-left max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Optimization</h2>
        <div className="space-y-4">
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
              <option value="avif" className="text-black">
                AVIF
              </option>
            </select>
          </div>

          {convertFormat !== "png" && (
            <div className="flex gap-4 items-center">
              <label className="font-medium">Quality:</label>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.1}
                value={compressionValue}
                onChange={(e) =>
                  setCompressionValue(parseFloat(e.target.value))
                }
                className="flex-1"
              />
              <span className="w-12 text-center">
                {Math.round(compressionValue * 100)}%
              </span>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={onOptimize}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Optimize
            </button>
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!optimizedImage}
            >
              Download
            </button>
          </div>
        </div>
      </div>

      {optimizedImage && (
        <div className="mt-8 text-left max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Before / After Comparison
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Original</h3>
              <img
                src={selectedImage}
                alt="Original"
                className="max-w-full max-h-64 border rounded shadow mx-auto"
              />
              <p className="mt-2 text-sm text-gray-600">
                Size:{" "}
                {imageInfo ? formatFileSize(imageInfo.fileSize) : "Unknown"}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Optimized</h3>
              <img
                src={optimizedImage}
                alt="Optimized"
                className="max-w-full max-h-64 border rounded shadow mx-auto"
              />
              <p className="mt-2 text-sm text-gray-600">
                Size:{" "}
                {optimizedSize ? formatFileSize(optimizedSize) : "Unknown"}
              </p>
            </div>
          </div>
          {imageInfo && optimizedSize && (
            <div className="text-center mt-4">
              <p className="text-lg font-medium">
                Size reduction:{" "}
                {formatFileSize(imageInfo.fileSize - optimizedSize)}(
                {((1 - optimizedSize / imageInfo.fileSize) * 100).toFixed(1)}%
                smaller)
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
