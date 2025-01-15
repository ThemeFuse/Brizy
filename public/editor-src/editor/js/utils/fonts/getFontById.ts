import {
  defaultFontSelector,
  fontsSelector,
  unDeletedFontsSelector
} from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { ReduxState } from "visual/redux/types";
import { Font } from "visual/types";
import { ArrayType, NonEmptyArray } from "visual/utils/array/types";
import { findFonts, fontTransform, projectFontsData } from "visual/utils/fonts";
import { FontFamilyType } from "visual/utils/fonts/familyType";

export type ModelFamilyType =
  | FontFamilyType.google
  | FontFamilyType.upload
  | FontFamilyType.system
  | FontFamilyType.adobe;
type RFonts = ReduxState["fonts"];
type DFonts = typeof fontTransform;
type StrictFonts = Required<RFonts>;
export type FontKeyTypes = keyof StrictFonts;
export type FontGroup<T extends FontKeyTypes> = {
  group: T;
  font: ArrayType<StrictFonts[T]["data"]>;
};

export type DefaultFont = FontGroup<FontKeyTypes>;
export type FontById = ReturnType<DFonts[ModelFamilyType]>;
export type GroupFontById = FontGroup<FontKeyTypes> | undefined;

export const getGroupFontsById = (fonts: RFonts, id: string): GroupFontById => {
  const entries = Object.entries(fonts) as NonEmptyArray<
    [FontKeyTypes, { data: Font[] }]
  >;

  return entries.reduce((acc, curr) => {
    const [group, { data = [] }] = curr;
    const getFont = fontTransform[group];
    const font = data.find((font) => id === getFont(font).id);

    return font ? { group, font } : acc;
  }, undefined as GroupFontById);
};

export const getDefaultFont = (state: ReduxState): DefaultFont => {
  const font = defaultFontSelector(state);
  const fonts = fontsSelector(state);

  const groups = getGroupFontsById(fonts, font);

  if (groups) {
    return groups;
  }

  const [[group, { data = [] }]] = Object.entries(fonts) as NonEmptyArray<
    [FontKeyTypes, { data: Font[] }]
  >;

  return { group, font: data[0] };
};

export const getFontById = ({
  type,
  family,
  fonts,
  store
}: {
  type: ModelFamilyType;
  family: string;
  fonts?: ReduxState["fonts"];
  store: Store;
}): FontById => {
  const _fonts = fonts ?? unDeletedFontsSelector(store.getState());

  const usedFonts = projectFontsData(_fonts);

  // @ts-expect-error: Property '[FontFamilyType.google]' does not exist on type '{}'.
  const font = findFonts(usedFonts[type], family, type);

  // Transform original Font Schema to Editor Font Schema
  if (font) {
    return fontTransform[type](font);
  }

  const defaultFont = getDefaultFont(store.getState());
  const getFont = fontTransform[defaultFont.group];

  return getFont(defaultFont.font);
};
