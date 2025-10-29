import { createContext, useReducer, useContext } from "react";
import {
  imageFilterReducer,
  initialImageFilterState,
  type ImageFilterState,
} from "~/reducers/imageFilterReducer";
import type { FilterAction } from "~/types/actions";

interface FilterContextType {
  state: ImageFilterState;
  dispatch: (action: FilterAction) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    imageFilterReducer,
    initialImageFilterState
  );

  return (
    <FilterContext.Provider value={{ state, dispatch }}>
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
