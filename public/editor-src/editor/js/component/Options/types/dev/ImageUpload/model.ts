import * as String from "visual/utils/string/index";
import * as Math from "visual/utils/math";
import { Getter } from "visual/utils/model";
import { patcher, Patcher } from "visual/utils/patch";

export interface ImageData {
  src: string;
  extension: string;
  width: number;
  height: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Image extends ImageData, Coordinates {}

/**
 * Get image src
 */
export const getExtension: Getter<string, ImageData> = (m, orElse) =>
  String.onEmpty(m.extension, orElse);

/**
 * Patch Image extension
 *
 * @param {string} v
 * @param {ImageData} m
 */
export const patchExtension: Patcher<string, Image, ImageData> = patcher(
  String.toString,
  getExtension,
  (v, m) => ({
    src: m.src,
    extension: v,
    width: m.width,
    height: m.height
  })
);

/**
 * Get image src
 */
export const getSrc: Getter<string, ImageData> = (m, orElse) =>
  String.onEmpty(m.src, orElse);

/**
 * Patch Image src
 *
 * @param {string} v
 * @param {ImageData} m
 */
export const patchSrc: Patcher<string, Image, ImageData> = patcher(
  String.toString,
  getSrc,
  (v, m) => ({
    src: v,
    extension: m.extension,
    width: m.width,
    height: m.height
  })
);

/**
 * Get image width
 */
export const getWidth: Getter<number, ImageData> = (m, orElse) =>
  Math.toNonNegative(m.width, orElse);

/**
 * Set image data width
 *
 * @param width
 * @param m
 * @return m
 */
export const patchWidth: Patcher<number, Image, ImageData> = patcher<
  number,
  Image,
  ImageData
>(Math.toNonNegative, getWidth, (v, m) => ({
  src: m.src,
  extension: m.extension,
  width: v,
  height: m.height
}));

/**
 * Get image height
 */
export const getHeight: Getter<number, ImageData> = (m, orElse) =>
  Math.toNonNegative(m.height, orElse);

/**
 * Set image data height
 *
 * @param width
 * @param m
 * @return m
 */
export const patchHeight: Patcher<number, Image, ImageData> = patcher<
  number,
  Image,
  ImageData
>(Math.toNonNegative, getHeight, (v, m) => ({
  src: m.src,
  extension: m.extension,
  width: m.width,
  height: v
}));

/**
 * Get X coordinates
 */
export const getX: Getter<number, Coordinates> = (m, orElse) =>
  Math.toNonNegative(m.x, orElse);

/**
 * Set X coordinates
 *
 * @param x
 * @param m
 * @return m
 */
export const patchX: Patcher<number, Image, Coordinates> = patcher<
  number,
  Image,
  Coordinates
>(Math.toNonNegative, getX, (v, m) => ({
  x: v,
  y: m.y
}));

/**
 * Get Y coordinates
 */
export const getY: Getter<number, Coordinates> = (m, orElse) =>
  Math.toNonNegative(m.y, orElse);

/**
 * Set Y coordinates
 *
 * @param y
 * @param m
 * @return m
 */
export const patchY: Patcher<number, Image, Coordinates> = patcher<
  number,
  Image,
  Coordinates
>(Math.toNonNegative, getY, (v, m) => ({
  x: m.x,
  y: v
}));
