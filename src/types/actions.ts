// src/types/actions.ts
import type { ActiveTool, ImageInfo } from "~/types/types";
import type { Layer, WorkingLayer } from "~/types/filters";

// UI Actions
export type UiAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_ACTIVE_SECTION"; payload: ActiveTool }
  | { type: "TOGGLE_TOOL_DRAWER" }
  | { type: "SET_DRAG_OVER"; payload: boolean };

// Image Actions
export type ImageAction =
  | { type: "SET_SELECTED_IMAGE"; payload: string | null }
  | { type: "SET_IMAGE_INFO"; payload: ImageInfo | null }
  | { type: "SET_PALETTE"; payload: number[][] | null }
  | { type: "SET_OPTIMIZED_IMAGE"; payload: string | null }
  | { type: "SET_OPTIMIZED_SIZE"; payload: number | null }
  | { type: "SET_CONVERT_FORMAT"; payload: string }
  | { type: "SET_COMPRESSION"; payload: number }
  | { type: "CLEAR_IMAGE" };

// // Filter Actions
export type FilterAction =
  | { type: "APPLY_LAYER" }
  | { type: "SET_WORKING_LAYER"; payload: WorkingLayer }
  | { type: "RESET_FILTERS" }
  | { type: "UNDO" }
  | { type: "REDO" };

// TODO: Implement these action types as needed
// // Transform Actions
// export type TransformAction =
//   | { type: "SET_SCALE"; payload: number }
//   | { type: "SET_WIDTH"; payload: number }
//   | { type: "SET_HEIGHT"; payload: number }
//   | { type: "SET_KEEP_ASPECT_RATIO"; payload: boolean }
//   | { type: "RESET_TRANSFORM" };
