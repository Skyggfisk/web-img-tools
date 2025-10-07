import { useState, useRef, useEffect, useCallback } from "react";

interface ImagePreviewProps {
  originalSrc: string;
  manipulatedSrc?: string;
  showComparison?: boolean;
  alt?: string;
  splitPosition?: number;
  onSplitPositionChange?: (position: number) => void;
}

export function ImagePreview({
  originalSrc,
  manipulatedSrc,
  showComparison = false,
  alt = "Preview",
  splitPosition: externalSplitPosition = 50,
  onSplitPositionChange,
}: ImagePreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Use external split position if provided, otherwise use local state
  const [localSplitPosition, setLocalSplitPosition] = useState(50);
  const splitPosition = externalSplitPosition;
  const setSplitPosition = onSplitPositionChange || setLocalSplitPosition;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const manipulatedImageRef = useRef<HTMLImageElement | null>(null);

  // Handle zoom with mouse wheel
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, zoom * delta));
      setZoom(newZoom);
    },
    [zoom]
  );

  // Handle mouse down for dragging (but not on slider)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    },
    [pan]
  );

  // Handle mouse move for dragging
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setPan({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, dragStart]
  );

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle touch events for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        if (touch) {
          setIsDragging(true);
          setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
        }
      }
    },
    [pan]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const touch = e.touches[0];
      if (touch) {
        e.preventDefault();
        setPan({
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y,
        });
      }
    },
    [isDragging, dragStart]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  // Handle image load to get dimensions and set initial zoom
  const handleImageLoad = useCallback(() => {
    if (originalImageRef.current) {
      const img = originalImageRef.current;
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;

      // Calculate initial zoom to fit the image in the viewport
      const container = containerRef.current;
      if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const scaleX = containerWidth / naturalWidth;
        const scaleY = containerHeight / naturalHeight;
        const initialZoom = Math.min(scaleX, scaleY, 1); // Don't zoom in if image is smaller than container

        setZoom(initialZoom);
        setPan({ x: 0, y: 0 }); // Center the image
      }
    }
  }, []);

  // Load original image (only when originalSrc changes)
  useEffect(() => {
    const originalImg = new Image();
    originalImg.crossOrigin = "anonymous";
    originalImg.onload = () => {
      originalImageRef.current = originalImg;
      handleImageLoad();
      drawCanvas();
    };
    originalImg.src = originalSrc;
  }, [originalSrc]);

  // Load manipulated image (only when manipulatedSrc changes)
  useEffect(() => {
    if (manipulatedSrc) {
      const manipulatedImg = new Image();
      manipulatedImg.crossOrigin = "anonymous";
      manipulatedImg.onload = () => {
        manipulatedImageRef.current = manipulatedImg;
        drawCanvas();
      };
      manipulatedImg.src = manipulatedSrc;
    } else {
      manipulatedImageRef.current = null;
      drawCanvas();
    }
  }, [manipulatedSrc]);

  // Draw the canvas with current zoom, pan, and split settings
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const originalImg = originalImageRef.current;
    const manipulatedImg = manipulatedImageRef.current;

    if (!canvas || !container || !originalImg) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to container size
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, containerWidth, containerHeight);

    // Save context for transformations
    ctx.save();

    // Apply zoom and pan transforms
    ctx.translate(containerWidth / 2 + pan.x, containerHeight / 2 + pan.y);
    ctx.scale(zoom, zoom);
    ctx.translate(
      -originalImg.naturalWidth / 2,
      -originalImg.naturalHeight / 2
    );

    if (showComparison && manipulatedImg && manipulatedSrc) {
      // Split view: draw original on left, manipulated on right
      const splitX = (splitPosition / 100) * containerWidth;

      // Convert split position to image coordinates
      const imageSplitX =
        (splitX - containerWidth / 2 - pan.x) / zoom +
        originalImg.naturalWidth / 2;

      // Draw original image (left portion)
      const leftWidth = Math.max(
        0,
        Math.min(originalImg.naturalWidth, imageSplitX)
      );
      if (leftWidth > 0) {
        ctx.drawImage(
          originalImg,
          0,
          0,
          leftWidth,
          originalImg.naturalHeight,
          0,
          0,
          leftWidth,
          originalImg.naturalHeight
        );
      }

      // Draw manipulated image (right portion)
      const rightStartX = Math.max(
        0,
        Math.min(originalImg.naturalWidth, imageSplitX)
      );
      const rightWidth = originalImg.naturalWidth - rightStartX;
      if (rightWidth > 0) {
        ctx.drawImage(
          manipulatedImg,
          rightStartX,
          0,
          rightWidth,
          originalImg.naturalHeight,
          rightStartX,
          0,
          rightWidth,
          originalImg.naturalHeight
        );
      }
    } else {
      // Single image view
      ctx.drawImage(originalImg, 0, 0);
    }

    // Restore context
    ctx.restore();
  }, [zoom, pan, splitPosition, showComparison, manipulatedSrc]);

  // Redraw when zoom, pan, or split position changes
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden cursor-move select-none bg-transparency-grid"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Canvas for image rendering */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          imageRendering: zoom > 1 ? "auto" : "auto",
        }}
      />

      {/* Zoom indicator */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}
