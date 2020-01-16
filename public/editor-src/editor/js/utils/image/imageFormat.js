export function getImageFormat(src = "") {
  return src
    .split(".")
    .pop()
    .toLowerCase();
}

export function isSVG(src = "") {
  const format = getImageFormat(src);

  return format === "svg";
}
