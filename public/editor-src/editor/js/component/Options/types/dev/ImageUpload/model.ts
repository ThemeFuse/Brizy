import { parse } from "fp-utilities";
import { pipe } from "visual/utils/fp";
import * as Math from "visual/utils/math";
import { Getter, Setter, setter } from "visual/utils/model";
import { prop } from "visual/utils/object/get";
import * as String from "visual/utils/string/index";

export interface Coordinates {
  x: number;
  y: number;
}

export interface Image {
  src: string;
  fileName: string;
  extension: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export function eq(a: Image, b: Image): boolean {
  return (
    a === b ||
    a.src === b.src ||
    a.extension === b.extension ||
    a.x === b.x ||
    a.y === b.y ||
    a.width === b.width ||
    a.height === b.height
  );
}

export const fromRecord = parse<Record<string, unknown>, Image>({
  src: pipe(prop("src"), String.toString),
  fileName: pipe(prop("fileName"), String.toString),
  extension: pipe(prop("extension"), String.toString),
  x: pipe(prop("x"), Math.toNonNegative),
  y: pipe(prop("y"), Math.toNonNegative),
  height: pipe(prop("height"), Math.toNonNegative),
  width: pipe(prop("width"), Math.toNonNegative)
});

/**
 * Get image src
 */
export const getExtension: Getter<string, Image> = (m, orElse) =>
  String.onEmpty(m.extension, orElse);

/**
 * Patch Image extension
 */
export const setExtension: Setter<string, Image> = setter(
  String.toString,
  getExtension,
  (v, m) => ({ ...m, extension: v })
);

/**
 * Get image src
 */
export const getSrc: Getter<string, Image> = (m, orElse) =>
  String.onEmpty(m.src, orElse);

/**
 * Patch Image src
 */
export const setSrc: Setter<string, Image> = setter(
  String.toString,
  getSrc,
  (v, m) => ({ ...m, src: v })
);

/**
 * Get image width
 */
export const getWidth: Getter<number, Image> = (m, orElse) =>
  Math.toNonNegative(m.width, orElse);

/**
 * Set image data width
 *
 * @param width
 * @param m
 * @return m
 */
export const setWidth: Setter<number, Image> = setter<number, Image>(
  Math.toNonNegative,
  getWidth,
  (v, m) => ({ ...m, width: v })
);

/**
 * Get image height
 */
export const getHeight: Getter<number, Image> = (m, orElse) =>
  Math.toNonNegative(m.height, orElse);

/**
 * Set image data height
 *
 * @param width
 * @param m
 * @return m
 */
export const setHeight: Setter<number, Image> = setter<number, Image>(
  Math.toNonNegative,
  getHeight,
  (v, m) => ({ ...m, height: v })
);

/**
 * Get X coordinates
 */
export const getX: Getter<number, Image> = (m, orElse) =>
  Math.toNonNegative(m.x, orElse);

/**
 * Set X coordinates
 *
 * @param x
 * @param m
 * @return m
 */
export const setX: Setter<number, Image> = setter<number, Image>(
  Math.toNonNegative,
  getX,
  (v, m) => ({ ...m, x: v })
);

/**
 * Get Y coordinates
 */
export const getY: Getter<number, Image> = (m, orElse) =>
  Math.toNonNegative(m.y, orElse);

/**
 * Set Y coordinates
 *
 * @param y
 * @param m
 * @return m
 */
export const setY: Setter<number, Image> = setter<number, Image>(
  Math.toNonNegative,
  getY,
  (v, m) => ({ ...m, y: v })
);
