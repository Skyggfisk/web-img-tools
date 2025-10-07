import type { ImageInfo } from "../types/types";
import { formatFileSize } from "./utils/imageUtils";

interface ImageInfoProps {
  imageInfo: ImageInfo;
}

export function ImageInfo({ imageInfo }: ImageInfoProps) {
  return (
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
  );
}
