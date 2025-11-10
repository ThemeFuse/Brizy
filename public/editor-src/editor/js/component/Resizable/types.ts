export enum ResizeType {
  North = "North",
  South = "South",
  East = "East",
  West = "West",
  NorthEast = "NorthEast",
  NorthWest = "NorthWest",
  SouthEast = "SouthEast",
  SouthWest = "SouthWest"
}

export type ResizeTypeOrNull = ResizeType | null;

export interface ResizableProps extends React.HTMLAttributes<HTMLDivElement> {
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  onResizeEnd?: (size: { width: number; height: number }) => void;
  initialLeft?: number;
  initialTop?: number;
}

export interface ResizeRefType {
  type: ResizeTypeOrNull;
  startX: number;
  startY: number;
  startW: number;
  startH: number;
  startL: number;
  startT: number;
}

export interface SizeRefType {
  width: number;
  height: number;
  left?: number;
  top?: number;
}
