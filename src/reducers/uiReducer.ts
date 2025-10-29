import type { UiAction } from "~/types/actions";
import type { ActiveTool } from "~/types/types";

export interface UiState {
  isLoadingImage: boolean;
  sidebarOpen: boolean;
  activeSection: ActiveTool;
  toolDrawerOpen: boolean;
  isDragOver: boolean;
}

export const initialUiState: UiState = {
  isLoadingImage: false,
  sidebarOpen: false,
  activeSection: "info",
  toolDrawerOpen: false,
  isDragOver: false,
};

export function uiReducer(state: UiState, action: UiAction): UiState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoadingImage: action.payload };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "SET_ACTIVE_SECTION":
      return { ...state, activeSection: action.payload };
    case "TOGGLE_TOOL_DRAWER":
      return { ...state, toolDrawerOpen: !state.toolDrawerOpen };
    case "SET_DRAG_OVER":
      return { ...state, isDragOver: action.payload };
    default:
      return state;
  }
}
