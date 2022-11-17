import {
  GridBoxedCellWidth,
  GridBoxesCellHeight
} from "elements/src/SectionGrid/types";

export type GridSimulator = {
  containerType: string;
  containerSize: number;
  gridHorizontalGap: number;
  gridVerticalGap: number;
  gridColumnsNr?: number;
  gridRowsNr: number;
  gridCellAspectRatio?: number;
  defaultGridHorizontalGap?: number;
  windowContainerSizeWidth?: number;
};

export type GridSimulatorData = {
  data: GridSimulator;
};

export type GridSimulatorBoxedCellWidth = GridBoxedCellWidth;

export type GridSimulatorBoxesCellHeight = GridBoxesCellHeight;

export type GridSimulatorBoxedPatternWidth = GridBoxedCellWidth & {
  gridHorizontalGap: number;
};

export type GridSimulatorBoxedPatternHeight = GridBoxesCellHeight & {
  gridVerticalGap: number;
};

export type GridSimulatorGridArea = {
  gridRowsNr: number;
  gridColumnsNr?: number;
};
