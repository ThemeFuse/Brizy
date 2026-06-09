import { FontFamilyType } from "visual/types/Fonts";
import { FontObject, FontWithType, FontsBlock } from "./types";

const getFontType = (key: string): FontFamilyType => {
  if (
    [
      FontFamilyType.adobe,
      FontFamilyType.upload,
      FontFamilyType.system
    ].includes(key as FontFamilyType)
  ) {
    return key as FontFamilyType;
  } else {
    return FontFamilyType.google;
  }
};

export const normalizeFonts = (
  fonts: FontsBlock,
  shouldSort: boolean = true
): FontWithType[] => {
  const normalizedFonts = Object.entries(fonts).flatMap(
    ([key, fontList = []]) =>
      fontList.map((font: FontObject) => ({
        ...font,
        type: font.variations?.length ? FontFamilyType.upload : getFontType(key)
      }))
  );

  if (shouldSort) {
    return normalizedFonts.sort((a, b) => a.title.localeCompare(b.title));
  }

  return normalizedFonts;
};
