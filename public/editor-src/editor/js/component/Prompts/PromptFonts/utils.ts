import { ReduxState } from "visual/redux/types";
import { Font } from "visual/types/Fonts";
import { FontGroup, FontTypes } from "./types";

export const compareFont = (a: Font, b: Font): 1 | -1 | 0 => {
  const familyA = a.family.toUpperCase();
  const familyB = b.family.toUpperCase();

  if (familyA < familyB) {
    return -1;
  }
  if (familyA > familyB) {
    return 1;
  }

  return 0;
};

export const sortFonts = (
  fonts: ReduxState["fonts"]
): FontGroup<FontTypes>[] => {
  return Object.entries(fonts)
    .map(([type, fontData]) => {
      const { data = [] } = fontData ?? { data: [] };
      return data.map((font: Font) => ({ ...font, fontGroupType: type }));
    })
    .reduce((acc, curr) => {
      return acc.concat(curr);
    }, [])
    .sort(compareFont);
};
