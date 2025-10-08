export interface ImageInfo {
  fileSize: number;
  dimensions: { width: number; height: number } | null;
  lastModified: Date | null;
  exif: any;
  format: string;
  name: string;
}

export type ActiveTool =
  | "info"
  | "optimization"
  | "filters"
  | "palette"
  | "transform";
