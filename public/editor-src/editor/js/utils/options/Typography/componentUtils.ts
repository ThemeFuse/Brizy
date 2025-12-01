import { flatten } from "es-toolkit";
import { Store } from "visual/redux/store";
import { DeviceMode } from "visual/types";
import { FontFamilyType } from "visual/types/Fonts";
import { getDefaultFont } from "visual/utils/fonts/getFontById";
import { getFontStyle } from "visual/utils/fonts/getFontStyle";
import { fontTransform } from "visual/utils/fonts/transform";
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
 * @return {Typography}
 * @param data
 */
export const getValue = (data: {
  device: DeviceMode;
  fonts: FontsBlock;
  store: Store;
  value: Value;
}): Value => {
  const { device, value: m, fonts, store } = data;
  const v =
    getFontStyle({
      id: m.fontStyle,
      store
    }) || m;
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

  const { group, font } = getDefaultFont(store.getState());
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

