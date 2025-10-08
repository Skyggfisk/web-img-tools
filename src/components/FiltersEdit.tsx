interface FiltersEditProps {
  hue: number;
  setHue: (value: number) => void;
  saturation: number;
  setSaturation: (value: number) => void;
  brightness: number;
  setBrightness: (value: number) => void;
  contrast: number;
  setContrast: (value: number) => void;
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
  onReset,
}: FiltersEditProps) {
  return (
    <div className="text-left mx-auto">
      <div className="space-y-6 flex">
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
