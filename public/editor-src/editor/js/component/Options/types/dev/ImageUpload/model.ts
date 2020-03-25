import * as String from "visual/utils/string/index";
import * as Math from "visual/utils/math";
import { Getter, setter, Setter } from "visual/utils/model";

export interface Coordinates {
  x: number;
  y: number;
}

export interface Image {
  src: string;
  extension: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

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
