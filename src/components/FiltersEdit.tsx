import { useState } from "react";

interface FiltersEditProps {
  hue: number;
  setHue: (value: number) => void;
  saturation: number;
  setSaturation: (value: number) => void;
  brightness: number;
  setBrightness: (value: number) => void;
  contrast: number;
  setContrast: (value: number) => void;
  grayscale: number;
  setGrayscale: (value: number) => void;
  invert: number;
  setInvert: (value: number) => void;
  blur: number;
  setBlur: (value: number) => void;
  onReset: () => void;
}

const filterPresets = {
  none: {
    hue: 0,
    saturation: 100,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    invert: 0,
    blur: 0,
    name: "None",
  },
  vintage: {
    hue: 15,
    saturation: 80,
    brightness: 110,
    contrast: 105,
    grayscale: 0,
    invert: 0,
    blur: 0,
    name: "Vintage",
  },
  cool: {
    hue: 200,
    saturation: 90,
    brightness: 105,
    contrast: 115,
    grayscale: 0,
    invert: 0,
    blur: 0,
    name: "Cool",
  },
  warm: {
    hue: 25,
    saturation: 110,
    brightness: 105,
    contrast: 105,
    grayscale: 0,
    invert: 0,
    blur: 0,
    name: "Warm",
  },
  dramatic: {
    hue: 0,
    saturation: 70,
    brightness: 90,
    contrast: 130,
    grayscale: 0,
    invert: 0,
    blur: 0,
    name: "Dramatic",
  },
  soft: {
    hue: 0,
    saturation: 85,
    brightness: 95,
    contrast: 85,
    grayscale: 0,
    invert: 0,
    blur: 0,
    name: "Soft",
  },
  highContrast: {
    hue: 0,
    saturation: 100,
    brightness: 110,
    contrast: 140,
    grayscale: 0,
    invert: 0,
    blur: 0,
    name: "High Contrast",
  },
  sepia: {
    hue: 35,
    saturation: 50,
    brightness: 100,
    contrast: 110,
    grayscale: 0,
    invert: 0,
    blur: 0,
    name: "Sepia",
  },
  blackAndWhite: {
    hue: 0,
    saturation: 0,
    brightness: 100,
    contrast: 120,
    grayscale: 100,
    invert: 0,
    blur: 0,
    name: "Black & White",
  },
  filmNoir: {
    hue: 0,
    saturation: 0,
    brightness: 80,
    contrast: 150,
    grayscale: 100,
    invert: 0,
    blur: 0,
    name: "Film Noir",
  },
  dreamy: {
    hue: 0,
    saturation: 90,
    brightness: 110,
    contrast: 105,
    grayscale: 0,
    invert: 0,
    blur: 3,
    name: "Dreamy",
  },
  negative: {
    hue: 0,
    saturation: 100,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    invert: 100,
    blur: 0,
    name: "Negative",
  },
};

export function FiltersEdit({
  hue,
  setHue,
  saturation,
  setSaturation,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  grayscale,
  setGrayscale,
  invert,
  setInvert,
  blur,
  setBlur,
  onReset,
}: FiltersEditProps) {
  const [selectedPreset, setSelectedPreset] =
    useState<keyof typeof filterPresets>("none");

  const applyPreset = (presetKey: keyof typeof filterPresets) => {
    const preset = filterPresets[presetKey];
    setHue(preset.hue);
    setSaturation(preset.saturation);
    setBrightness(preset.brightness);
    setContrast(preset.contrast);
    setGrayscale(preset.grayscale);
    setInvert(preset.invert);
    setBlur(preset.blur);
    setSelectedPreset(presetKey);
  };

  const handleReset = () => {
    onReset();
    setSelectedPreset("none");
  };

  return (
    <div className="text-left mx-auto">
      <div className="space-y-6">
        {/* Filter Presets */}
        <div>
          <h3 className="text-lg font-medium mb-3">Filter Presets</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-20 text-sm font-medium">Preset:</label>
              <select
                value={selectedPreset}
                onChange={(e) =>
                  applyPreset(e.target.value as keyof typeof filterPresets)
                }
                className="flex-1 bg-neutral-500 text-white rounded px-2 py-1"
              >
                {Object.entries(filterPresets).map(([key, preset]) => (
                  <option key={key} value={key}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
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

          {/* Effects */}
          <div>
            <h3 className="text-lg font-medium mb-3">Effects</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="w-20 text-sm font-medium">Grayscale:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={grayscale}
                  onChange={(e) => setGrayscale(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="w-12 text-center text-sm">{grayscale}%</span>
              </div>

              <div className="flex items-center gap-4">
                <label className="w-20 text-sm font-medium">Invert:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={invert}
                  onChange={(e) => setInvert(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="w-12 text-center text-sm">{invert}%</span>
              </div>

              <div className="flex items-center gap-4">
                <label className="w-20 text-sm font-medium">Blur:</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="w-12 text-center text-sm">{blur}px</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={handleReset}
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
