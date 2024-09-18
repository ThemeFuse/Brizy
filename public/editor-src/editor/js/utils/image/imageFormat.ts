import { getFileFormat } from "visual/utils/customFile/utils";

export function isSVG(src: string): boolean {
  const format = getFileFormat(src);
  return format === "svg";
}
