export const calcRectangleSide = (
  value: number,
  asValue: number,
  delta: number
): number => (delta * value) / asValue;

export const calcRectangleSize = (
  value: number,
  width: number,
  height: number,
  delta: { dx: number; dy: number }
): number => {
  const { dx, dy } = delta;
  const ratioX = dx / width;
  const ratioY = dy / height;

  return ratioX < ratioY ? (dx / width) * value : (dy / height) * value;
};

export const calcMaxHeightBasedOnWidth = (
  widthMax: number,
  rectWidth: number,
  rectHeight: number,
  valueWidth: number,
  valueHeight: number
): number => {
  const maxRectWidth = (widthMax * rectWidth) / valueWidth;

  const maxRectHeight = (rectHeight * maxRectWidth) / rectWidth;

  return (maxRectHeight * valueHeight) / rectHeight;
};
