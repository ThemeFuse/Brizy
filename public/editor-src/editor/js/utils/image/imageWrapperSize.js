export default function imageWrapperSize(width, height, maxWrapperWidth) {
  const point =
    width > height ? width / maxWrapperWidth : height / maxWrapperWidth;

  return {
    width: Math.round(width / point),
    height: Math.round(height / point)
  };
}
