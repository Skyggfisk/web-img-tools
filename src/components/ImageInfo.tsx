import type { ImageInfo } from "~/types/types";
import { formatFileSize } from "~/utils/imageUtils";

interface ImageInfoProps {
  imageInfo: ImageInfo;
}

// calculate greatest common divisor
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function getSimplifiedAspectRatio(width: number, height: number): string {
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

function formatFileName(fileName: string): string {
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
  if (nameWithoutExt.length > 20) {
    return nameWithoutExt.slice(0, 20) + "[...]";
  }
  return nameWithoutExt;
}

export function ImageInfo({ imageInfo }: ImageInfoProps) {
  return (
    <div className="text-left mx-auto flex gap-8">
      {/* Basic info */}
      <div className="grid grid-cols-[auto_1fr] mb-4 grid-rows-[min-content] self-start [&>:nth-child(4n+1)]:bg-black/10 [&>:nth-child(4n+2)]:bg-black/10 [&>:nth-child(4n+3)]:bg-white/5 [&>:nth-child(4n+4)]:bg-white/5">
        <strong className="pr-3 p-1">File Name:</strong>
        <span className="p-1" title={imageInfo.name}>
          {formatFileName(imageInfo.name)}
        </span>

        <strong className="pr-3 p-1">File Size:</strong>
        <span className="p-1">{formatFileSize(imageInfo.fileSize)}</span>

        {imageInfo.format && (
          <>
            <strong className="pr-3 p-1">Format:</strong>
            <span className="p-1">.{imageInfo.format.toUpperCase()}</span>
          </>
        )}

        {imageInfo.dimensions && (
          <>
            <strong className="pr-3 p-1">Dimensions:</strong>
            <span className="p-1">
              {imageInfo.dimensions.width} x {imageInfo.dimensions.height}{" "}
              pixels
            </span>
            <strong className="pr-3 p-1">Aspect:</strong>
            <span className="p-1">
              {getSimplifiedAspectRatio(
                imageInfo.dimensions.width,
                imageInfo.dimensions.height
              )}
            </span>
          </>
        )}

        {imageInfo.lastModified && (
          <>
            <strong className="pr-3 p-1">Modified:</strong>
            <span className="p-1">
              {imageInfo.lastModified.toLocaleString(undefined, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </span>
          </>
        )}
      </div>

      {/* EXIF Data */}
      {imageInfo.exif && Object.keys(imageInfo.exif).length > 0 && (
        <div>
          <strong>EXIF Data:</strong>
          <pre className="text-sm bg-neutral-700 overflow-x-hidden max-h-40">
            {JSON.stringify(imageInfo.exif, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
