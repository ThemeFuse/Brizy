export const easeInOutQuad = (
  t: number,
  b: number,
  c: number,
  d: number
): number => {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

export const toSamePage = (targetPath: string, location: Location): boolean => {
  const { href, hash } = location;

  const currentPath = href.replace(hash, "");

  return (
    currentPath.includes(targetPath) &&
    Math.abs(currentPath.length - targetPath.length) <= 1
  );
};
