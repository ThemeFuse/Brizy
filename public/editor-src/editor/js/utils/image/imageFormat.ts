import { MValue } from "visual/utils/value";

export function getImageFormat(src: string): MValue<string> {
  return src.split(".").pop()?.toLowerCase();
}

export function isSVG(src: string): boolean {
  const format = getImageFormat(src);
  return format === "svg";
}
