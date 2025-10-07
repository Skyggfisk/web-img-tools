interface ImageUploadProps {
  isDragOver: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
}

export function ImageUpload({
  isDragOver,
  onFileChange,
  onDrop,
  onDragOver,
  onDragLeave,
}: ImageUploadProps) {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 mb-4 transition-colors ${
        isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
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
  );
}
