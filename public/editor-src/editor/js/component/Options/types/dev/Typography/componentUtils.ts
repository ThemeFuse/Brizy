import { DeviceMode } from "visual/types";
import { fontTransform, getFontStyle } from "visual/utils/fonts";
import { FontFamilyType } from "visual/utils/fonts/familyType";
import { DefaultFont } from "visual/utils/fonts/getFontById";
import { defaultValueValue } from "visual/utils/onChange";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
import { defaultValue, fromElementModel } from "./converters";
import { FontsBlock } from "./types/FontsBlocks";
import { Value } from "./types/Value";

const hasFont = (fonts: FontsBlock, fontId: string): boolean => {
  return Object.values(fonts).some((fontList) =>
    fontList?.some((font) => font.id === fontId)
  );
};

/**
 * @param device
 * @param fonts
 * @param defaultFont
 * @param {Typography} m
 * @return {Typography}
 */
export const getValue = (
  device: DeviceMode,
  fonts: FontsBlock,
  defaultFont: DefaultFont,
  m: Value
): Value => {
  const v = getFontStyle(m.fontStyle) || m;

  const get = (key: string): MValue<Literal> =>
    key === "fontStyle" ? m.fontStyle : defaultValueValue({ key, v, device });

  const model = {
    ...defaultValue,
    ...fromElementModel(get)
  };

  if (hasFont(fonts, model.fontFamily)) {
    return model;
  }

  const { group, font } = defaultFont;
  const getFont = fontTransform[group];
  const family = getFont(font).id;

  switch (group) {
    case "config":
    case "blocks":
    case "google": {
      return {
        ...model,
        fontFamilyType: FontFamilyType.google,
        fontFamily: family
      };
    }
    case "upload": {
      return {
        ...model,
        fontFamilyType: FontFamilyType.upload,
        fontFamily: family
      };
    }
    case "system": {
      return {
        ...model,
        fontFamilyType: FontFamilyType.system,
        fontFamily: family
      };
    }
  }
};
