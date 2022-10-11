import { MValue } from "visual/utils/value";

const rgx = /\.[^.]+$/;

export function getImageFormat(src: string): MValue<string> {
  const result = rgx.exec(src);

  if (result && result.length) {
    const [ext] = result; // .ext
    return ext.replace(".", "").toLowerCase();
  }

  return undefined;
}

export function isSVG(src: string): boolean {
  const format = getImageFormat(src);
  return format === "svg";
}
