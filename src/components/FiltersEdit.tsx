import { useState } from "react";
import { useFilter } from "~/contexts/FilterContext";

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

export function FiltersEdit() {
  const { state: filterState, dispatch: filterDispatch } = useFilter();

  const [selectedPreset, setSelectedPreset] =
    useState<keyof typeof filterPresets>("none");

  const applyPreset = (presetKey: keyof typeof filterPresets) => {
    const preset = filterPresets[presetKey];

    filterDispatch({
      type: "SET_WORKING_LAYER",
      payload: {
        hue: preset.hue,
        saturation: preset.saturation,
        brightness: preset.brightness,
        contrast: preset.contrast,
        grayscale: preset.grayscale,
        invert: preset.invert,
        blur: preset.blur,
      },
    });
    setSelectedPreset(presetKey);
  };

  // const undo = () => {
  //   if (filterState.historyIndex < 0) return; // No more history to undo

  //   if (filterState.historyIndex === 0) {
  //     // Reset to initial state
  //     filterDispatch({
  //       type: "SET_WORKING_LAYER",
  //       payload: {
  //         hue: 0,
  //         saturation: 100,
  //         brightness: 100,
  //         contrast: 100,
  //         grayscale: 0,
  //         invert: 0,
  //         blur: 0,
  //       },
  //     });
  //   } else {
  //     // undo previous state
  //     const prevState = filterState.editHistory[filterState.historyIndex - 1];
  //     filterDispatch({
  //       type: "SET_WORKING_LAYER",
  //       payload: {
  //         hue: prevState!.hue,
  //         saturation: prevState!.saturation,
  //         brightness: prevState!.brightness,
  //         contrast: prevState!.contrast,
  //         grayscale: prevState!.grayscale,
  //         invert: prevState!.invert,
  //         blur: prevState!.blur,
  //       },
  //     });
  //   }
  // };

  // const redo = () => {
  //   if (filterState.historyIndex >= filterState.editHistory.length - 1) return; // No more history to redo

  //   const nextIndex = filterState.historyIndex + 1;
  //   const nextState = filterState.editHistory[nextIndex];

  //   filterDispatch({
  //     type: "SET_WORKING_LAYER",
  //     payload: {
  //       hue: nextState!.hue,
  //       saturation: nextState!.saturation,
  //       brightness: nextState!.brightness,
  //       contrast: nextState!.contrast,
  //       grayscale: nextState!.grayscale,
  //       invert: nextState!.invert,
  //       blur: nextState!.blur,
  //     },
  //   });
  // };

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
                  value={filterState.workingLayer.hue}
                  onChange={(e) =>
                    filterDispatch({
                      type: "SET_WORKING_LAYER",
                      payload: {
                        ...filterState.workingLayer,
                        hue: Number(e.target.value),
                      },
                    })
                  }
                  className="flex-1"
                />
                <span className="w-12 text-center text-sm">
                  {filterState.workingLayer.hue}°
                </span>
              </div>

              <div className="flex items-center gap-4">
                <label className="w-20 text-sm font-medium">Saturation:</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filterState.workingLayer.saturation}
                  onChange={(e) =>
                    filterDispatch({
                      type: "SET_WORKING_LAYER",
                      payload: {
                        ...filterState.workingLayer,
                        saturation: Number(e.target.value),
                      },
                    })
                  }
                  className="flex-1"
                />
                <span className="w-12 text-center text-sm">
                  {filterState.workingLayer.saturation}%
                </span>
              </div>

              <div className="flex items-center gap-4">
                <label className="w-20 text-sm font-medium">Brightness:</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filterState.workingLayer.brightness}
                  onChange={(e) =>
                    filterDispatch({
                      type: "SET_WORKING_LAYER",
                      payload: {
                        ...filterState.workingLayer,
                        brightness: Number(e.target.value),
                      },
                    })
                  }
                  className="flex-1"
                />
                <span className="w-12 text-center text-sm">
                  {filterState.workingLayer.brightness}%
                </span>
              </div>

              <div className="flex items-center gap-4">
                <label className="w-20 text-sm font-medium">Contrast:</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filterState.workingLayer.contrast}
                  onChange={(e) =>
                    filterDispatch({
                      type: "SET_WORKING_LAYER",
                      payload: {
                        ...filterState.workingLayer,
                        contrast: Number(e.target.value),
                      },
                    })
                  }
                  className="flex-1"
                />
                <span className="w-12 text-center text-sm">
                  {filterState.workingLayer.contrast}%
                </span>
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
                  value={filterState.workingLayer.grayscale}
                  onChange={(e) =>
                    filterDispatch({
                      type: "SET_WORKING_LAYER",
                      payload: {
                        ...filterState.workingLayer,
                        grayscale: Number(e.target.value),
                      },
                    })
                  }
                  className="flex-1"
                />
                <span className="w-12 text-center text-sm">
                  {filterState.workingLayer.grayscale}%
                </span>
              </div>

              <div className="flex items-center gap-4">
                <label className="w-20 text-sm font-medium">Invert:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filterState.workingLayer.invert}
                  onChange={(e) =>
                    filterDispatch({
                      type: "SET_WORKING_LAYER",
                      payload: {
                        ...filterState.workingLayer,
                        invert: Number(e.target.value),
                      },
                    })
                  }
                  className="flex-1"
                />
                <span className="w-12 text-center text-sm">
                  {filterState.workingLayer.invert}%
                </span>
              </div>

              <div className="flex items-center gap-4">
                <label className="w-20 text-sm font-medium">Blur:</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={filterState.workingLayer.blur}
                  onChange={(e) =>
                    filterDispatch({
                      type: "SET_WORKING_LAYER",
                      payload: {
                        ...filterState.workingLayer,
                        blur: Number(e.target.value),
                      },
                    })
                  }
                  className="flex-1"
                />
                <span className="w-12 text-center text-sm">
                  {filterState.workingLayer.blur}px
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => filterDispatch({ type: "UNDO" })}
          disabled={filterState.historyIndex < 0}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
        >
          Undo
        </button>
        <button
          onClick={() => filterDispatch({ type: "REDO" })}
          disabled={
            filterState.historyIndex >= filterState.editHistory.length - 1
          }
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
        >
          Redo
        </button>
        <button
          onClick={() => filterDispatch({ type: "RESET_FILTERS" })}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
        >
          Reset All
        </button>
        <button
          onClick={() => filterDispatch({ type: "APPLY_LAYER" })}
          className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 cursor-pointer"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
