interface TransformEditProps {
  scale: number;
  setScale: (value: number) => void;
  width: number;
  setWidth: (value: number) => void;
  height: number;
  setHeight: (value: number) => void;
  keepAspectRatio: boolean;
  setKeepAspectRatio: (value: boolean) => void;
  originalWidth: number;
  originalHeight: number;
  onReset: () => void;
}

export function TransformEdit({
  scale,
  setScale,
  width,
  setWidth,
  height,
  setHeight,
  keepAspectRatio,
  setKeepAspectRatio,
  originalWidth,
  originalHeight,
  onReset,
}: TransformEditProps) {
  const aspectRatio = originalWidth / originalHeight;

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (keepAspectRatio) {
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (keepAspectRatio) {
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  return (
    <div className="text-left mx-auto">
      <div className="space-y-6">
        {/* Scale Control */}
        <div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-20 text-sm font-medium">Scale:</label>
              <input
                type="range"
                min="10"
                max="200"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="flex-1"
              />
              <span className="w-12 text-center text-sm">{scale}%</span>
            </div>
          </div>
        </div>

        {/* Dimensions Control */}
        <div>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <label className="w-20 text-sm font-medium">Dimensions:</label>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="bg-neutral-500 text-right w-20"
              />
              <span className="text-sm">×</span>
              <input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="bg-neutral-500 text-right w-20"
              />
              <span className="text-sm">px</span>
            </div>
            <div className="flex items-center gap-2 ml-24">
              <input
                type="checkbox"
                id="keep-aspect-ratio"
                checked={keepAspectRatio}
                onChange={(e) => setKeepAspectRatio(e.target.checked)}
              />
              <label htmlFor="keep-aspect-ratio" className="text-sm">
                Keep aspect ratio
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
        >
          Reset All
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 cursor-pointer"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
