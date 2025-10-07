interface FiltersEditProps {
  hue: number;
  setHue: (value: number) => void;
  saturation: number;
  setSaturation: (value: number) => void;
  brightness: number;
  setBrightness: (value: number) => void;
  contrast: number;
  setContrast: (value: number) => void;
  rotation: number;
  setRotation: (value: number) => void;
  scale: number;
  setScale: (value: number) => void;
  selectedImage: string;
  onReset: () => void;
}

export function FiltersEdit({
  hue,
  setHue,
  saturation,
  setSaturation,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  rotation,
  setRotation,
  scale,
  setScale,
  selectedImage,
  onReset,
}: FiltersEditProps) {
  return (
    <div className="text-left max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Filters & Edit</h2>
      <div className="space-y-6">
        {/* Color Adjustments */}
        <div>
          <h3 className="text-lg font-medium mb-3">Color Adjustments</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-20 text-sm font-medium">Hue:</label>
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => setHue(Number(e.target.value))}
                className="flex-1"
              />
              <span className="w-12 text-center text-sm">{hue}°</span>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-20 text-sm font-medium">Saturation:</label>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="flex-1"
              />
              <span className="w-12 text-center text-sm">{saturation}%</span>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-20 text-sm font-medium">Brightness:</label>
              <input
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="flex-1"
              />
              <span className="w-12 text-center text-sm">{brightness}%</span>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-20 text-sm font-medium">Contrast:</label>
              <input
                type="range"
                min="0"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="flex-1"
              />
              <span className="w-12 text-center text-sm">{contrast}%</span>
            </div>
          </div>
        </div>

        {/* Transform Controls */}
        <div>
          <h3 className="text-lg font-medium mb-3">Transform</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-20 text-sm font-medium">Rotation:</label>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="flex-1"
              />
              <span className="w-12 text-center text-sm">{rotation}°</span>
            </div>

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

        {/* Preview */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Preview</h3>
          <div className="border rounded p-4 bg-gray-50">
            <img
              src={selectedImage}
              alt="Edited Preview"
              className="max-w-full max-h-64 mx-auto border rounded"
              style={{
                filter: `hue-rotate(${hue}deg) saturate(${saturation}%) brightness(${brightness}%) contrast(${contrast}%)`,
                transform: `rotate(${rotation}deg) scale(${scale / 100})`,
                transformOrigin: "center",
              }}
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-center">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
}
