interface ImagePreviewProps {
  src: string;
  alt?: string;
}

export function ImagePreview({ src, alt = "Preview" }: ImagePreviewProps) {
  return (
    <div className="mt-4">
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-96 border rounded shadow mx-auto"
      />
    </div>
  );
}
