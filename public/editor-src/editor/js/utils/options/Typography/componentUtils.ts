import { flatten, partition } from "underscore";
import { FontObject } from "visual/component/Controls/FontFamily/types";
import { DividedFonts } from "visual/component/Controls/Typography/types/FontFamily";
import { DeviceMode } from "visual/types";
import { fontTransform, getFontStyle } from "visual/utils/fonts";
import { FontFamilyType } from "visual/utils/fonts/familyType";
import { DefaultFont } from "visual/utils/fonts/getFontById";
import { defaultValueValue } from "visual/utils/onChange";
import {
  defaultValue,
  fromElementModel
} from "visual/utils/options/Typography/converters";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
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

  const {
    bold,
    underline,
    strike,
    italic,
    uppercase,
    lowercase,
    script,
    ...otherValues
  } = fromElementModel(get);

  const model = {
    ...defaultValue,
    ...otherValues,
    bold: bold ?? m.bold,
    underline: underline ?? m.underline,
    strike: strike ?? m.strike,
    italic: italic ?? m.italic,
    uppercase: uppercase ?? m.uppercase,
    lowercase: lowercase ?? m.lowercase,
    script: script ?? m.script
  };

  if (hasFont(fonts, model.fontFamily)) {
    const _variations = flatten(Object.values(fonts)).find(
      (font) => font.id === model.fontFamily
    )?.variations;

    const variations = _variations ? { variations: _variations } : {};

    return {
      ...model,
      ...variations
    };
  }

  const { group, font } = defaultFont;
  const getFont = fontTransform[group];

  const { id: family, variations } = getFont(font);

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
    case "adobe": {
      return {
        ...model,
        fontFamilyType: FontFamilyType.adobe,
        fontFamily: family
      };
    }
    case "upload": {
      return {
        ...model,
        fontFamilyType: FontFamilyType.upload,
        fontFamily: family,
        variations
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

const isVariableFont = (font: FontObject) => !!font.variations?.length;

export const divideFonts = (fonts: FontsBlock): DividedFonts =>
  Object.entries(fonts).reduce<DividedFonts>(
    (acc, [fontName, fontData]) => {
      const [variableFonts, normalFonts] = partition(fontData, isVariableFont);

      return {
        variableFonts: [...acc.variableFonts, ...variableFonts],
        normalFonts: {
          ...acc.normalFonts,
          [fontName]: normalFonts
        }
      };
    },
    { variableFonts: [], normalFonts: {} }
  );
