export interface FilterValues {
  hue: number;
  saturation: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  invert: number;
  blur: number;
}

export interface Layer {
  type: string;
  values: FilterValues;
}

export type WorkingLayer = FilterValues;
export type EditHistory = FilterValues[];
