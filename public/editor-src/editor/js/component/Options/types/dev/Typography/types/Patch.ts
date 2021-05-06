import { FontFamily, FontSettings, FontStyle } from "./Value";
import * as FamilyType from "visual/utils/fonts/familyType";
import * as SizeSuffix from "visual/utils/fonts/SizeSuffix";

export type Patch = FontFamily | FontSettings | FontStyle;

export const isFontStyle = (p: Patch): p is FontStyle =>
  typeof (p as Partial<FontStyle>).fontStyle === "string";

export const isFontFamily = (p: Patch): p is FontFamily =>
  FamilyType.is((p as FontFamily).fontFamilyType);

export const isFontSettings = (p: Patch): p is FontSettings =>
  SizeSuffix.is((p as FontSettings).fontSizeSuffix);
