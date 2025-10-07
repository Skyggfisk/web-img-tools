interface ColorPaletteProps {
  palette: number[][];
}

export function ColorPalette({ palette }: ColorPaletteProps) {
  return (
    <div className="mt-8 text-left max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Color Palette</h2>
      <div className="flex flex-wrap gap-2">
        {palette.map((color, index) => (
          <div
            key={index}
            className="w-12 h-12 rounded border"
            style={{
              backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
            }}
            title={`RGB(${color[0]}, ${color[1]}, ${color[2]})`}
          ></div>
        ))}
      </div>
    </div>
  );
}
