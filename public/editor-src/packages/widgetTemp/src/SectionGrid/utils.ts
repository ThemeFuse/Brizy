import {
  GridBoxedCellWidth,
  GridBoxesCellHeight,
  GridCellHeight,
  GridCellWidth,
  GridFullWidthCellHeight,
  GridFullWidthCellWidth
} from "./types";

// Boxes Grid Cell Width
export const gridBoxedCellWidth = (sectionGrid: GridBoxedCellWidth): number => {
  const {
    containerSize = 1170,
    gridHorizontalGap = 10,
    gridColumnsNr = 24
  } = sectionGrid;

  // Aici sunt 23 de gaps din motiv ca 100% lungime fara sidebar si fara gaps si ele sunt scoase deja
  // cele 2 gaps dreapta stinga
  const gridHorizontalGapNr = gridColumnsNr - 1;

  return (
    (containerSize - gridHorizontalGapNr * gridHorizontalGap) / gridColumnsNr
  );
};

// Full Width Grid Cell Width
export const gridFullWidthCellWidth = (
  sectionGrid: GridFullWidthCellWidth
): string => {
  const { gridHorizontalGap = 10, gridColumnsNr = 24 } = sectionGrid;

  // https://codepen.io/Mamboleoo/post/scrollbars-and-css-custom-properties
  const gridHorizontalGapNr = gridColumnsNr + 1;

  // (var(--brz-scrollbar-width, 0) * 1px)
  // 15px is browser scroll size
  // hook care calculeza marimea la sidebar trebuei de trecut in elements din UI
  return `calc((100vw - ${
    gridHorizontalGapNr * gridHorizontalGap
  }px - 15px ) / ${gridColumnsNr})`;
};

// Boxed Grid Cell Height
export const gridBoxesCellHeight = (
  sectionGrid: GridBoxesCellHeight
): number => {
  const {
    gridHorizontalGap = 10,
    defaultGridHorizontalGap = 10,
    gridColumnsNr = 24,
    gridCellAspectRatio = 0.64 // H: 25 / W: 39 = 0.64
  } = sectionGrid;

  const gridHorizontalGapNr = gridColumnsNr - 1;

  const gridCellWidthforHeight =
    ((gridHorizontalGap - defaultGridHorizontalGap) / gridColumnsNr) *
      gridHorizontalGapNr +
    gridBoxedCellWidth(sectionGrid);

  return gridCellWidthforHeight * gridCellAspectRatio;
};

// Boxed Grid Cell Height
export const gridFullWidthCellHeight = (
  sectionGrid: GridFullWidthCellHeight
): string => {
  const {
    gridHorizontalGap = 10,
    defaultGridHorizontalGap = 10,
    gridColumnsNr = 24,
    gridCellAspectRatio = 0.64 // H: 25 / W: 39 = 0.64
  } = sectionGrid;

  const gridHorizontalGapNr = gridColumnsNr - 1;

  const gridCellWidthforHeight = `calc(${
    ((gridHorizontalGap - defaultGridHorizontalGap) / gridColumnsNr) *
    gridHorizontalGapNr
  }px + ${gridFullWidthCellWidth(sectionGrid)})`;

  return `calc(${gridCellWidthforHeight} * ${gridCellAspectRatio})`;
};

// Grid Cell Width
export const gridCellWidth = (sectionGrid: GridCellWidth): string => {
  const { containerType = "boxed" } = sectionGrid;

  return containerType === "boxed"
    ? `${gridBoxedCellWidth(sectionGrid)}px`
    : gridFullWidthCellWidth(sectionGrid);
};

// Grid Cell Height
export const gridCellHeight = (sectionGrid: GridCellHeight): string => {
  const { containerType = "boxed" } = sectionGrid;

  return containerType === "boxed"
    ? `${gridBoxesCellHeight(sectionGrid)}px`
    : gridFullWidthCellHeight(sectionGrid);
};
