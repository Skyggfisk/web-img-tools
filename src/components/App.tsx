import { useReducer, useState } from "react";
import { parse } from "exifr";
import ColorThief from "colorthief";
import "~/styles/index.css";
import type { ImageInfo } from "~/types/types";
import { BurgerMenu } from "./BurgerMenu";
import { ImageUpload } from "./ImageUpload";
import { Sidebar } from "./Sidebar";
import { ImageInfo as ImageInfoComponent } from "./ImageInfo";
import { ColorPalette } from "./ColorPalette";
import { Optimization } from "./Optimization";
import { FiltersEdit } from "./FiltersEdit";
import { ClearImageButton } from "./ClearImageButton";
import { ToolDrawer } from "./ToolDrawer";
import { LoadingSpinner } from "./LoadingSpinner";
import { ImagePreview } from "./ImagePreview";
import { initialUiState, uiReducer } from "~/reducers/uiReducer";
import {
  imageDataReducer,
  initialImageState,
} from "~/reducers/imageDataReducer";
import { FilterProvider } from "~/contexts/FilterContext";

export function App() {
  // UI state
  const [uiState, uiDispatch] = useReducer(uiReducer, initialUiState);

  // Image/Data state
  const [imageState, imageDispatch] = useReducer(
    imageDataReducer,
    initialImageState
  );

  // Image/Transform state
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const extractImageInfo = async (file: File) => {
    uiDispatch({ type: "SET_LOADING", payload: true });

    const info: ImageInfo = {
      fileSize: file.size,
      dimensions: null,
      lastModified: new Date(file.lastModified),
      exif: null,
      format: file.type.split("/")[1] || "unknown",
      name: file.name,
    };

    // Extract EXIF
    try {
      info.exif = await parse(file);
    } catch (error) {
      console.log("No EXIF data or error parsing:", error);
    }

    // Extract dimensions and palette
    const img = new Image();
    img.onload = () => {
      info.dimensions = { width: img.naturalWidth, height: img.naturalHeight };
      imageDispatch({ type: "SET_IMAGE_INFO", payload: { ...info } });

      // Set initial dimensions for the filters
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);

      // Extract palette
      const colorThief = new ColorThief();
      try {
        const colors = colorThief.getPalette(img, 32, 5);
        imageDispatch({ type: "SET_PALETTE", payload: colors });
      } catch (error) {
        console.log("Error extracting palette:", error);
      }
      uiDispatch({ type: "SET_LOADING", payload: false });
    };
    img.src = URL.createObjectURL(file);

    imageDispatch({ type: "SET_IMAGE_INFO", payload: info });
  };

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      imageDispatch({ type: "SET_SELECTED_IMAGE", payload: url });
      imageDispatch({ type: "SET_OPTIMIZED_IMAGE", payload: null });
      imageDispatch({ type: "SET_OPTIMIZED_SIZE", payload: null });
      extractImageInfo(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    uiDispatch({ type: "SET_DRAG_OVER", payload: false });
    const file = event.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    uiDispatch({ type: "SET_DRAG_OVER", payload: true });
  };

  const handleDragLeave = () => {
    uiDispatch({ type: "SET_DRAG_OVER", payload: false });
  };

  const handleOptimize = () => {
    if (!imageState.selectedImage) return;

    const canvas = document.createElement("canvas");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            imageDispatch({ type: "SET_OPTIMIZED_IMAGE", payload: url });
            imageDispatch({ type: "SET_OPTIMIZED_SIZE", payload: blob.size });
          }
        },
        `image/${imageState.convertFormat}`,
        imageState.compression
      );
    };

    img.src = imageState.selectedImage;
  };

  const clearImage = () => {
    imageDispatch({ type: "SET_SELECTED_IMAGE", payload: null });
    imageDispatch({ type: "SET_IMAGE_INFO", payload: null });
    imageDispatch({ type: "SET_PALETTE", payload: null });
    imageDispatch({ type: "SET_OPTIMIZED_IMAGE", payload: null });
    imageDispatch({ type: "SET_OPTIMIZED_SIZE", payload: null });
    setWidth(0);
    setHeight(0);
  };

  const handleDownload = () => {
    const imageToDownload =
      imageState.optimizedImage || imageState.selectedImage;
    if (!imageToDownload) return;

    const canvas = document.createElement("canvas");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `optimized.${imageState.convertFormat}`;
            a.click();
            URL.revokeObjectURL(url);
          }
        },
        `image/${imageState.convertFormat}`,
        imageState.convertFormat === "png" ? undefined : imageState.compression
      );
    };

    img.src = imageToDownload;
  };

  return (
    <FilterProvider>
      <div className="h-dvh w-screen relative overflow-x-hidden">
        {/* Menu section */}
        <BurgerMenu
          isOpen={uiState.sidebarOpen}
          onToggle={() => uiDispatch({ type: "TOGGLE_SIDEBAR" })}
        />
        {imageState.selectedImage && (
          <ClearImageButton clearImage={clearImage} />
        )}
        <Sidebar
          isOpen={uiState.sidebarOpen}
          activeSection={uiState.activeSection}
          onSectionChange={(section) =>
            uiDispatch({ type: "SET_ACTIVE_SECTION", payload: section })
          }
          onClose={() => uiDispatch({ type: "TOGGLE_SIDEBAR" })}
        />
        {/* Tool Drawer */}
        {imageState.selectedImage && (
          <ToolDrawer
            toolDrawerOpen={uiState.toolDrawerOpen}
            setToolDrawerOpen={() => uiDispatch({ type: "TOGGLE_TOOL_DRAWER" })}
            activeSection={uiState.activeSection}
          >
            {/* Conditional tools content */}
            {uiState.activeSection === "info" && imageState.imageInfo && (
              <ImageInfoComponent imageInfo={imageState.imageInfo} />
            )}

            {uiState.activeSection === "palette" && imageState.palette && (
              <ColorPalette palette={imageState.palette} />
            )}

            {uiState.activeSection === "optimization" && (
              <Optimization
                convertFormat={imageState.convertFormat || "png"}
                setConvertFormat={(value) =>
                  imageDispatch({
                    type: "SET_CONVERT_FORMAT",
                    payload: value,
                  })
                }
                compressionValue={imageState.compression || 0.8}
                setCompressionValue={(value) =>
                  imageDispatch({
                    type: "SET_COMPRESSION",
                    payload: value,
                  })
                }
                onOptimize={handleOptimize}
                onDownload={handleDownload}
                optimizedImage={imageState.optimizedImage}
                imageInfo={imageState.imageInfo}
                optimizedSize={imageState.optimizedSize}
              />
            )}

            {uiState.activeSection === "filters" && <FiltersEdit />}
          </ToolDrawer>
        )}
        {/* Title and upload image section */}
        {!imageState.selectedImage && (
          <ImageUpload
            isDragOver={uiState.isDragOver}
            onFileChange={handleFileChange}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          />
        )}
        {/* Loader */}
        {imageState.selectedImage && uiState.isLoadingImage && (
          <LoadingSpinner message="Loading image..." />
        )}
        {/* Image preview section */}
        {imageState.selectedImage && !uiState.isLoadingImage && (
          <ImagePreview
            imageSrc={imageState.selectedImage}
            width={width}
            height={height}
          />
        )}
      </div>
    </FilterProvider>
  );
}

export default App;
