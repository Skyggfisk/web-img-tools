import { createContext, useReducer, useContext, type ReactNode } from "react";
import {
  imageFilterReducer,
  initialImageFilterState,
  type ImageFilterState,
} from "~/reducers/imageFilterReducer";
import type { WorkingLayer } from "~/types/filters";

interface FilterContextType {
  filterState: ImageFilterState;
  setWorkingLayer: (layer: WorkingLayer) => void;
  applyFilter: () => void;
  resetFilters: () => void;
  undo: () => void;
  redo: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filterState, dispatch] = useReducer(
    imageFilterReducer,
    initialImageFilterState
  );

  const setWorkingLayer = (layer: WorkingLayer) => {
    dispatch({ type: "SET_WORKING_LAYER", payload: layer });
  };
  const applyFilter = () => {
    dispatch({ type: "APPLY_LAYER" });
  };
  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
  };
  const undo = () => {
    dispatch({ type: "UNDO" });
  };
  const redo = () => {
    dispatch({ type: "REDO" });
  };

  return (
    <FilterContext.Provider
      value={{
        filterState,
        setWorkingLayer,
        applyFilter,
        undo,
        resetFilters,
        redo,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
