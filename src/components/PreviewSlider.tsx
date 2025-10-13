interface PreviewSliderProps {
  comparisonSplitPosition: number;
  setComparisonSplitPosition: (value: number) => void;
}

export const PreviewSlider = ({
  comparisonSplitPosition,
  setComparisonSplitPosition,
}: PreviewSliderProps) => {
  return (
    <>
      {/* Split indicator bar - full height vertical line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-black/50 shadow-lg z-10"
        style={{
          left: `calc(50% + ${comparisonSplitPosition - 50}%)`,
          transform: "translateX(-50%)",
        }}
      />

      {/* Slider handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 shadow-xl rounded-full cursor-ew-resize z-20 flex items-center justify-center "
        style={{
          left: `calc(50% + ${comparisonSplitPosition - 50}%)`,
          transform: "translateX(-50%) translateY(-50%)",
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          const startX = e.clientX;
          const startPosition = comparisonSplitPosition;

          const handleMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - startX;
            const containerWidth = window.innerWidth;
            const deltaPercent = (deltaX / containerWidth) * 100;
            const newPosition = Math.max(
              0,
              Math.min(100, startPosition + deltaPercent)
            );
            setComparisonSplitPosition(newPosition);
          };

          const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
          };

          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        }}
      >
        <span className="text-white text-xl font-bold select-none">
          {"< >"}
        </span>
      </div>
    </>
  );
};
