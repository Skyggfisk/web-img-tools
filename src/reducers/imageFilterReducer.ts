import type { FilterAction } from "~/types/actions";
import type { EditHistory, Layer, WorkingLayer } from "~/types/filters";

export interface ImageFilterState {
  layers: Layer[];
  workingLayer: WorkingLayer;
  editHistory: EditHistory;
  historyIndex: number;
}

export const initialImageFilterState: ImageFilterState = {
  layers: [],
  workingLayer: {
    hue: 0,
    saturation: 100,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    invert: 0,
    blur: 0,
  },
  editHistory: [],
  historyIndex: -1,
};

export function imageFilterReducer(
  state: ImageFilterState,
  action: FilterAction
): ImageFilterState {
  switch (action.type) {
    case "SET_WORKING_LAYER":
      return { ...state, workingLayer: action.payload };
    case "APPLY_LAYER":
      const newLayer: Layer = {
        type: "committed",
        values: { ...state.workingLayer },
      };
      return {
        ...state,
        layers: [...state.layers, newLayer],
        workingLayer: initialImageFilterState.workingLayer,
        editHistory: [...state.editHistory, state.workingLayer],
        historyIndex: state.historyIndex + 1,
      };
    case "RESET_FILTERS":
      return {
        ...state,
        layers: [],
        workingLayer: initialImageFilterState.workingLayer,
        editHistory: [],
        historyIndex: -1,
      };
    case "UNDO":
      if (state.historyIndex < 0) return state; // No invalid undo
      if (state.historyIndex === 0) {
        // Undo to empty state
        return {
          ...state,
          layers: [],
          workingLayer: initialImageFilterState.workingLayer,
          historyIndex: -1,
        };
      }
      // Undo to previous state
      const prevState = state.editHistory[state.historyIndex - 1];
      return {
        ...state,
        layers: state.layers.slice(0, -1),
        workingLayer: prevState!, // TODO: handle undefined
        historyIndex: state.historyIndex - 1,
      };
    case "REDO":
      if (state.historyIndex >= state.editHistory.length - 1) return state; // No invalid redo
      const nextIndex = state.historyIndex + 1;
      const nextState = state.editHistory[nextIndex];
      const nextLayer: Layer = {
        type: "committed",
        values: nextState!, // TODO: handle undefined
      };
      return {
        ...state,
        layers: [...state.layers, nextLayer],
        workingLayer: nextState!, // TODO: handle undefined
        historyIndex: nextIndex,
      };
    default:
      return state;
  }
}
