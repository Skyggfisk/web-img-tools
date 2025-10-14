import { Application, extend } from "@pixi/react";
import {
  Assets,
  BlurFilter,
  ColorMatrixFilter,
  Container,
  Graphics,
  Sprite,
  Texture,
} from "pixi.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PreviewSlider } from "./PreviewSlider";
import { ZoomOverlay } from "./ZoomOverlay";

interface ImagePreviewProps {
  imageSrc: string;
  width: number;
  height: number;
  saturation: number;
  brightness: number;
  contrast: number;
  hue: number;
  grayscale: number;
  invert: number;
  blur: number;
  showComparison?: boolean;
}

extend({ Container, Sprite, Texture, Graphics, BlurFilter, ColorMatrixFilter });

export const ImagePreview = (props: ImagePreviewProps) => {
  const {
    imageSrc,
    width,
    height,
    saturation,
    brightness,
    contrast,
    hue,
    grayscale,
    invert,
    blur,
    showComparison = false,
  } = props;

  const [sourceImageTexture, setSourceTexture] = useState(Texture.EMPTY);
  const [manipulatedImageTexture, setManipulatedImageTexture] = useState(
    Texture.EMPTY
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [comparisonSplitPosition, setComparisonSplitPosition] =
    useState<number>(50);

  // load the texture
  useEffect(() => {
    if (sourceImageTexture === Texture.EMPTY) {
      Assets.load({ src: imageSrc, parser: "loadTextures" })
        .then((loadedTexture) => {
          setSourceTexture(loadedTexture);
          setManipulatedImageTexture(loadedTexture);
        })
        .catch((err) => {
          console.error("Error loading image:", err);
        });
    }
  }, [imageSrc]);

  const filters = useMemo(() => {
    const filterList = [];

    // create a blur filter
    if (blur > 0) {
      const blurFilter = new BlurFilter();
      blurFilter.blur = blur;
      filterList.push(blurFilter);
    }

    // color adjustment filters - multiply (stack) false for now
    const colorMatrix = new ColorMatrixFilter();
    if (hue !== 0) colorMatrix.hue(hue, false);
    if (saturation !== 100) colorMatrix.saturate(saturation / 100 - 1, false);
    if (brightness !== 100) colorMatrix.brightness(brightness / 100, false);
    if (contrast !== 100) colorMatrix.contrast(contrast / 100, false);
    if (grayscale > 0) colorMatrix.grayscale(grayscale / 100, false);
    if (invert > 0) colorMatrix.negative(false); // invert is boolean
    // TODO: more filters and presets available check later
    filterList.push(colorMatrix);

    return filterList;
  }, [hue, saturation, brightness, contrast, grayscale, invert, blur]);

  const splitMask = useMemo(() => {
    if (!showComparison) return null;
    const mask = new Graphics();
    mask.rect(
      0,
      0,
      (comparisonSplitPosition / 100) * window.innerWidth,
      window.innerHeight
    );
    mask.fill(0xffffff);
    return mask;
  }, [showComparison, comparisonSplitPosition, width, height]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, zoom * delta));
      setZoom(newZoom);
    },
    [zoom]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    },
    [pan]
  );

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

  const handleMouseUp = useCallback(() => {
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
    // Calculate initial zoom to fit the image in the viewport
    const container = containerRef.current;
    if (container) {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const scaleX = containerWidth / width;
      const scaleY = containerHeight / height;
      const initialZoom = Math.min(scaleX, scaleY, 1); // Don't zoom in if image is smaller than container

      setZoom(initialZoom);
    }
  }, []);

  useEffect(() => {
    handleImageLoad();
  }, [imageSrc, handleImageLoad]);

  return (
    <>
      <div
        className="relative w-full h-full overflow-hidden cursor-move select-none bg-transparency-grid"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Application
          backgroundAlpha={0}
          resolution={window.devicePixelRatio || 1}
          resizeTo={window}
        >
          <pixiContainer
            x={pan.x}
            y={pan.y}
            scale={zoom}
            pivot={{ x: width / 2, y: height / 2 }}
            rotation={(rotation * Math.PI) / 180}
          >
            {/* Manipulated image, order matters here */}
            {showComparison && (
              <pixiSprite
                texture={manipulatedImageTexture}
                width={width}
                height={height}
                filters={filters}
              />
            )}

            {/* Original image */}
            <pixiSprite
              texture={sourceImageTexture}
              width={width}
              height={height}
              mask={showComparison ? splitMask : undefined}
            />
          </pixiContainer>
        </Application>
      </div>
      <ZoomOverlay
        zoom={zoom}
        setZoom={setZoom}
        rotation={rotation}
        setRotation={setRotation}
      />
      {showComparison && (
        <PreviewSlider
          comparisonSplitPosition={comparisonSplitPosition}
          setComparisonSplitPosition={setComparisonSplitPosition}
        />
      )}
    </>
  );
};
