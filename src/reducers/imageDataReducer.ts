import type { ImageAction } from "~/types/actions";
import type { ImageInfo } from "~/types/types";

export interface ImageState {
  selectedImage: string | null;
  imageInfo: ImageInfo | null;
  palette: number[][] | null;
  optimizedImage: string | null;
  optimizedSize: number | null;
  convertFormat?: string;
  compression?: number;
}

export const initialImageState: ImageState = {
  selectedImage: null,
  imageInfo: null,
  palette: null,
  optimizedImage: null,
  optimizedSize: null,
  convertFormat: "png",
  compression: 0.8,
};

export function imageDataReducer(
  state: ImageState,
  action: ImageAction
): ImageState {
  switch (action.type) {
    case "SET_SELECTED_IMAGE":
      return { ...state, selectedImage: action.payload };
    case "SET_IMAGE_INFO":
      return { ...state, imageInfo: action.payload };
    case "SET_PALETTE":
      return { ...state, palette: action.payload };
    case "CLEAR_IMAGE":
      return { ...state, selectedImage: null, imageInfo: null, palette: null };
    case "SET_COMPRESSION":
      return { ...state, compression: action.payload };
    case "SET_CONVERT_FORMAT":
      return { ...state, convertFormat: action.payload };
    case "SET_OPTIMIZED_IMAGE":
      return { ...state, optimizedImage: action.payload };
    case "SET_OPTIMIZED_SIZE":
      return { ...state, optimizedSize: action.payload };
    default:
      return state;
  }
}
