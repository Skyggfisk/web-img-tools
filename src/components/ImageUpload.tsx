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
    <div className="max-w-7xl mx-auto text-center">
      <h1 className="text-5xl font-bold my-4 leading-tight">Web Image Tools</h1>
      <p className="mb-8 text-neutral-400">
        View, analyze, and edit images in your browser. Fully local and private.
      </p>
      <p className="mb-8 text-neutral-400">
        ⚠️ Please note that the app is under development and may not work as
        expected.
      </p>
      <div
        className={`border-2 border-dashed rounded-lg p-8 mb-4 transition-colors size-[50vh] justify-self-center flex justify-center items-center ${
          isDragOver ? "border-sky-500 bg-sky-50" : "border-neutral-500"
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
          <div className="text-neutral-500">
            <p className="text-lg font-semibold">Click to select an image</p>
            <p>or drag and drop it here</p>
          </div>
        </label>
      </div>
    </div>
  );
}
