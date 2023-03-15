import {
  gridBoxedCellWidth,
  gridBoxesCellHeight
} from "widgetTemp/SectionGrid/utils";
import {
  GridSimulator,
  GridSimulatorBoxedCellWidth,
  GridSimulatorBoxedPatternHeight,
  GridSimulatorBoxedPatternWidth,
  GridSimulatorBoxesCellHeight,
  GridSimulatorGridArea
} from "./types";

// Window Container Size Width
export const windowContainerSizeWidth = (
  sectionGridSimulator: GridSimulator,
  windowWidth: number
): GridSimulator => {
  const {
    containerType = "boxed",
    containerSize = 1170,
    gridHorizontalGap = 10
  } = sectionGridSimulator;

  return containerType === "boxed"
    ? { ...sectionGridSimulator, containerSize }
    : {
        ...sectionGridSimulator,
        containerSize: windowWidth - 2 * gridHorizontalGap
      };
};

// Grid Pattern Width
export const gridSimulatorCellWidth = (
  sectionGridSimulator: GridSimulatorBoxedCellWidth
): number => {
  return gridBoxedCellWidth(sectionGridSimulator);
};

// Grid Pattern Height
export const gridSimulatorCellHeight = (
  sectionGridSimulator: GridSimulatorBoxesCellHeight
): number => {
  return gridBoxesCellHeight(sectionGridSimulator);
};

// Grid Pattern Width
export const gridSimulatorPatternWidth = (
  sectionGridSimulator: GridSimulatorBoxedPatternWidth
): number => {
  const { gridHorizontalGap = 10 } = sectionGridSimulator;

  return gridBoxedCellWidth(sectionGridSimulator) + gridHorizontalGap;
};

// Grid Pattern Height
export const gridSimulatorPatternHeight = (
  sectionGridSimulator: GridSimulatorBoxedPatternHeight
): number => {
  const { gridVerticalGap = 10 } = sectionGridSimulator;

  return gridBoxesCellHeight(sectionGridSimulator) + gridVerticalGap;
};

// Grid Area
export const gridSimulatorGridArea = (
  sectionGridSimulator: GridSimulatorGridArea
): string => {
  const { gridRowsNr = 5, gridColumnsNr = 24 } = sectionGridSimulator;

  return `1/2/${1 + gridRowsNr}/${2 + gridColumnsNr}`;
};
