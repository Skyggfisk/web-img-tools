export interface ImageInfo {
  fileSize: number;
  dimensions: { width: number; height: number } | null;
  lastModified: Date | null;
  exif: any;
}
