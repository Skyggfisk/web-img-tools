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
  imageInfo: ImageInfo | null;
  optimizedSize: number | null;
}

const formatOptions = ["png", "jpeg", "webp", "avif"];

export function Optimization({
  convertFormat,
  setConvertFormat,
  compressionValue,
  setCompressionValue,
  onOptimize,
  onDownload,
  optimizedImage,
  imageInfo,
  optimizedSize,
}: OptimizationProps) {
  return (
    <>
      <div className="text-left max-w-md mx-auto">
        <div className="space-y-4">
          {/* Format Selection */}
          <div className="flex items-center gap-4">
            <label htmlFor="format-select" className="font-medium">
              Format:
            </label>
            <select
              id="format-select"
              value={convertFormat}
              onChange={(e) => setConvertFormat(e.target.value)}
              className="bg-neutral-500 rounded px-2 py-1 cursor-pointer"
            >
              {formatOptions.map((format) => (
                <option key={format} value={format}>
                  {format.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Compression Quality */}
          <div className="flex gap-4 items-center">
            <label className="font-medium">Quality:</label>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.1}
              value={compressionValue}
              onChange={(e) => setCompressionValue(parseFloat(e.target.value))}
              className={`flex-1 ${
                convertFormat === "png" ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={convertFormat === "png"}
              title={
                convertFormat === "png"
                  ? "Quality not applicable for PNG format"
                  : undefined
              }
            />
            <span className="w-12 text-center">
              {Math.round(compressionValue * 100)}%
            </span>
          </div>

          {/* Optimization Results */}
          {optimizedImage && imageInfo && optimizedSize && (
            <div className="mt-4 flex items-center justify-between gap-4">
              <label className="font-medium">New size:</label>
              {imageInfo.fileSize > optimizedSize ? (
                <>
                  <span>{formatFileSize(optimizedSize)}</span>
                  <span className="text-emerald-500 font-semibold">
                    ↓
                    {Math.abs(
                      (1 - optimizedSize / imageInfo.fileSize) * 100
                    ).toFixed(1)}
                    %
                  </span>
                </>
              ) : (
                <>
                  <span>{formatFileSize(optimizedSize)}</span>
                  <span className="text-rose-500 font-semibold">
                    ↑
                    {Math.abs(
                      (optimizedSize / imageInfo.fileSize - 1) * 100
                    ).toFixed(1)}
                    %
                  </span>
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 items-center justify-center">
            <button
              onClick={onOptimize}
              className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 cursor-pointer"
            >
              Optimize
            </button>
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 cursor-pointer"
              disabled={!optimizedImage}
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
