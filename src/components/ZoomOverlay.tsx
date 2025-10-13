interface ZoomOverlayProps {
  zoom: number;
  setZoom: (value: number | ((prev: number) => number)) => void;
  rotation: number;
  setRotation: (value: number | ((prev: number) => number)) => void;
}

export const ZoomOverlay = ({
  zoom,
  setZoom,
  rotation,
  setRotation,
}: ZoomOverlayProps) => {
  return (
    <div className="absolute top-4 right-4 flex gap-2 select-none">
      <div
        className="bg-black/50  px-3 py-1 rounded text-sm cursor-pointer"
        onClick={() => setZoom(1)}
        title="Zoom, click to reset"
      >
        {Math.round(zoom * 100)}%
      </div>
      <div
        className="bg-black/50 px-3 py-1 rounded text-sm cursor-pointer"
        onClick={() => setZoom((z) => Math.min(z + 0.1, 5))}
      >
        +
      </div>
      <div
        className="bg-black/50  px-3 py-1 rounded text-sm cursor-pointer"
        onClick={() => setZoom((z) => Math.max(z - 0.1, 0.1))}
      >
        -
      </div>
      <div
        className="bg-black/50 px-3 py-1 rounded text-sm cursor-pointer"
        onClick={(e) => {
          if (e.ctrlKey) {
            setRotation(0);
          } else {
            setRotation((r) => (r + 90) % 360);
          }
        }}
        title="Rotate 90° clockwise"
      >
        ↻
      </div>
    </div>
  );
};
