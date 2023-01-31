export type GridBoxedCellWidth = {
  containerSize: number;
  gridHorizontalGap: number;
  gridColumnsNr?: number;
};

export type GridFullWidthCellWidth = {
  gridHorizontalGap: number;
  gridColumnsNr?: number;
};

export type GridBoxesCellHeight = GridBoxedCellWidth & {
  defaultGridHorizontalGap?: number;
  gridCellAspectRatio?: number;
};

export type GridFullWidthCellHeight = GridFullWidthCellWidth & {
  defaultGridHorizontalGap?: number;
  gridCellAspectRatio?: number;
};

export type GridCellWidth = GridBoxedCellWidth &
  GridFullWidthCellWidth & { containerType: string };

export type GridCellHeight = GridBoxesCellHeight &
  GridFullWidthCellHeight & { containerType: string };
