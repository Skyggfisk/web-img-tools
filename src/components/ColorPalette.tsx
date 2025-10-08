import { useState } from "react";

interface ColorPaletteProps {
  palette: number[][];
}

export function ColorPalette({ palette }: ColorPaletteProps) {
  const [numColors, setNumColors] = useState(6);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const displayedColors = palette.slice(0, numColors);

  // Convert RGB array to HEX string
  const rgbToHex = (r: number, g: number, b: number): string => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  // Copy HEX value to clipboard
  const copyToClipboard = async (hex: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(index);
      // Clear the copied state after 1.5 seconds
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = hex;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  // Download palette as JSON
  const downloadPalette = () => {
    const paletteData: { [key: string]: string } = {};

    displayedColors.forEach((color, index) => {
      const hex = rgbToHex(color[0] ?? 0, color[1] ?? 0, color[2] ?? 0);
      const colorKey = `color_${String(index + 1).padStart(2, "0")}`;
      paletteData[colorKey] = hex;
    });

    const jsonString = JSON.stringify(paletteData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "color-palette.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="text-left max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Color Palette</h2>

      {/* Number of colors slider */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Number of Colors: {numColors}
        </label>
        <input
          type="range"
          min="3"
          max="32"
          value={numColors}
          onChange={(e) => setNumColors(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Color grid */}
      <div className="grid grid-cols-8 gap-2 max-w-lg">
        {displayedColors.map((color, index) => {
          const hex = rgbToHex(color[0] ?? 0, color[1] ?? 0, color[2] ?? 0);
          const isCopied = copiedIndex === index;

          return (
            <div
              key={index}
              className={`w-10 h-10 rounded border cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                isCopied ? "ring-2 ring-green-400 ring-offset-2" : ""
              }`}
              style={{
                backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
              }}
              title={`RGB(${color[0] ?? 0}, ${color[1] ?? 0}, ${
                color[2] ?? 0
              }) | ${hex} ${isCopied ? "(Copied!)" : "(Click to copy)"}`}
              onClick={() => copyToClipboard(hex, index)}
            >
              {isCopied && (
                <div className="w-full h-full rounded border flex items-center justify-center bg-black bg-opacity-50 text-white text-xs font-bold">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Download button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={downloadPalette}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Download Palette as JSON
        </button>
      </div>
    </div>
  );
}
