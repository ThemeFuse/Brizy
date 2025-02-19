import { FontFamilyType } from "visual/types/Fonts";
import { pass } from "visual/utils/fp";

/**
 * @deprecated, use FontFamilyType.google
 */
export const GOOGLE = FontFamilyType.google;

/**
 * @deprecated, use FontFamilyType.upload
 */
export const UPLOAD = FontFamilyType.upload;

export const types = Object.values(FontFamilyType);

export const is = (v: string): v is FontFamilyType =>
  types.includes(v as FontFamilyType);

export const fromString = pass(is);
