import { optional, or, parse } from "fp-utilities";
import { pipe } from "visual/utils/fp";
import { ImageType } from "visual/utils/image/types";
import { toNonNegative } from "visual/utils/math";
import { type Getter, type Setter, setter } from "visual/utils/model";
import { prop } from "visual/utils/object/get";
import { readImageType } from "visual/utils/options/ImageUpload/utils";
import * as Str from "visual/utils/string";

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
  imageType: ImageType;
  altTitle?: string;
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
  src: pipe(prop("src"), Str.asString),
  fileName: pipe(prop("fileName"), Str.asString),
  extension: pipe(prop("extension"), Str.asString),
  x: pipe(prop("x"), toNonNegative),
  y: pipe(prop("y"), toNonNegative),
  height: pipe(prop("height"), toNonNegative),
  width: pipe(prop("width"), toNonNegative),
  imageType: pipe(
    prop("imageType"),
    or(readImageType, () => ImageType.Internal)
  ),
  altTitle: optional(pipe(prop("altTitle"), Str.asString))
});

/**
 * Get image src
 */
export const getExtension: Getter<string, Image> = (m, orElse) =>
  Str.onEmpty(m.extension, orElse);

/**
 * Patch Image extension
 */
export const setExtension: Setter<string, Image> = setter(
  Str.asString,
  getExtension,
  (v, m) => ({ ...m, extension: v })
);

/**
 * Get image src
 */
export const getSrc: Getter<string, Image> = (m, orElse) =>
  Str.onEmpty(m.src, orElse);

/**
 * Patch Image src
 */
export const setSrc: Setter<string, Image> = setter(
  Str.asString,
  getSrc,
  (v, m) => ({ ...m, src: v })
);

/**
 * Get image width
 */
export const getWidth: Getter<number, Image> = (m, orElse) =>
  toNonNegative(m.width, orElse);

/**
 * Set image data width
 *
 * @param width
 * @param m
 * @return m
 */
export const setWidth: Setter<number, Image> = setter<number, Image>(
  toNonNegative,
  getWidth,
  (v, m) => ({ ...m, width: v })
);

/**
 * Get image height
 */
export const getHeight: Getter<number, Image> = (m, orElse) =>
  toNonNegative(m.height, orElse);

/**
 * Set image data height
 *
 * @param width
 * @param m
 * @return m
 */
export const setHeight: Setter<number, Image> = setter<number, Image>(
  toNonNegative,
  getHeight,
  (v, m) => ({ ...m, height: v })
);

/**
 * Get X coordinates
 */
export const getX: Getter<number, Image> = (m, orElse) =>
  toNonNegative(m.x, orElse);

/**
 * Set X coordinates
 *
 * @param x
 * @param m
 * @return m
 */
export const setX: Setter<number, Image> = setter<number, Image>(
  toNonNegative,
  getX,
  (v, m) => ({ ...m, x: v })
);

/**
 * Get Y coordinates
 */
export const getY: Getter<number, Image> = (m, orElse) =>
  toNonNegative(m.y, orElse);

/**
 * Set Y coordinates
 *
 * @param y
 * @param m
 * @return m
 */
export const setY: Setter<number, Image> = setter<number, Image>(
  toNonNegative,
  getY,
  (v, m) => ({ ...m, y: v })
);
