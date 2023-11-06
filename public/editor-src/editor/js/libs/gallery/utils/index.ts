export const adjustImagesWidthByContainerWidth = (
  computedWidths: number[],
  containerWidth: number
): number[] =>
  computedWidths
    .map((width) => (width > containerWidth ? containerWidth : width))
    .filter(Boolean);
