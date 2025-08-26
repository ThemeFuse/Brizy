import { setIn } from "timm";
import { DeviceMode } from "visual/types";
import { TextScripts } from "visual/types/Style";
import { defaultValueValue } from "visual/utils/onChange";
import { isObject } from "visual/utils/reader/object";
import { capByPrefix, encodeToString } from "visual/utils/string";

export interface Value {
  linkType: string;
  linkPopup: string;
  linkExternal: string;
  linkExternalBlank: string;
  linkExternalRel: string;
  linkPopulation: string;
  linkAnchor: string;
  linkUpload: string;
  linkToSlide: number;
  linkPopulationEntityId: string;
  linkPopulationEntityType: string;
  linkPage: string;
  linkPageTitle: string;
  linkPageSource: string;
  linkInternalBlank: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  capitalize: string;
  lowercase: string;
  script: TextScripts;
  typographyFontStyle: string;
  // Text Transform Values can also be string from quill formats
  typographyBold: boolean | string;
  typographyItalic: boolean | string;
  typographyUnderline: boolean | string;
  typographyStrike: boolean | string;
  typographyUppercase: boolean;
  typographyLowercase: string;
  typographyScript: TextScripts;

  tooltip: string;
  tooltipId: string;
}

export type Patch = Partial<Value>;

export const handleChangeLink = (v: Value, value: Patch) => {
  const linkAnchor = value.linkAnchor ?? v.linkAnchor;
  const linkPopup = value.linkPopup ?? v.linkPopup;

  return {
    link: encodeToString({
      type: value.linkType ?? v.linkType,
      anchor: linkAnchor ? `#${linkAnchor}` : "",
      external: value.linkExternal ?? v.linkExternal,
      externalBlank: value.linkExternalBlank ?? v.linkExternalBlank,
      externalRel: value.linkExternalRel ?? v.linkExternalRel,
      externalType:
        value.linkPopulation || v.linkPopulation ? "population" : "external",
      population: value.linkPopulation ?? v.linkPopulation,
      populationEntityId:
        value.linkPopulationEntityId ?? v.linkPopulationEntityId,
      populationEntityType:
        value.linkPopulationEntityType ?? v.linkPopulationEntityType,
      popup: linkPopup ? `#${linkPopup}` : "",
      upload: value.linkUpload ?? v.linkUpload,
      linkToSlide: value.linkToSlide ?? v.linkToSlide,
      internal: value.linkPage ?? v.linkPage,
      internalBlank: value.linkInternalBlank ?? v.linkInternalBlank,
      pageTitle: value.linkPageTitle ?? v.linkPageTitle,
      pageSource: value.linkPageSource ?? v.linkPageSource
    })
  };
};

interface PopulationColor {
  [k: string]: {
    hex: string;
    opacity: number;
    colorPalette: string;
  };
}

export const getPopulationColor = (
  populationColor: PopulationColor,
  type: string,
  value: Record<string, unknown>
) => {
  const hex = capByPrefix("paragraphColor", `${type}Hex`);
  const opacity = capByPrefix("paragraphColor", `${type}Opacity`);
  const palette = capByPrefix("paragraphColor", `${type}Palette`);

  if (value[palette]) {
    const paletteValue = setIn(populationColor, [type], {
      colorPalette: value[palette],
      opacity: value[opacity] ?? 1
    });

    if (isObject(paletteValue)) {
      return encodeToString(setIn(paletteValue, [type, "hex"], null));
    }
  }

  const hexValue = setIn(populationColor, [type, "hex"], value[hex]);
  const opacityValue =
    isObject(hexValue) && setIn(hexValue, [type, "opacity"], value[opacity]);

  if (isObject(opacityValue)) {
    return encodeToString(setIn(opacityValue, [type, "colorPalette"], null));
  }

  return "";
};

const isCustomFontStyle = (v: Patch, device: DeviceMode) => {
  const value = defaultValueValue({ v, key: "typographyFontStyle", device });
  return value === "custom" || value === "";
};

export const patchTextTransform = (
  patch: Patch,
  device: DeviceMode,
  v: Patch = {}
): Patch => {
  const isCustom = isCustomFontStyle(patch, device);

  const {
    typographyBold = v.bold,
    typographyItalic = v.italic,
    typographyUnderline = v.underline,
    typographyStrike = v.strike,
    typographyUppercase = v.capitalize,
    typographyLowercase,
    typographyScript
  } = patch;

  return {
    ...patch,
    bold: Boolean(isCustom && typographyBold),
    italic: Boolean(isCustom && typographyItalic),
    underline: Boolean(isCustom && typographyUnderline),
    strike: Boolean(isCustom && typographyStrike),
    capitalize: isCustom && typographyUppercase ? "on" : "",
    typographyLowercase: typographyLowercase ? "on" : "",
    script: typographyScript
  };
};

export const fromFormatsToTextTransform = ({
  bold,
  italic,
  strike,
  underline,
  capitalize,
  script
}: Patch) => ({
  typographyBold: bold,
  typographyItalic: italic,
  typographyStrike: strike,
  typographyUnderline: underline,
  typographyUppercase: capitalize === "on",
  typographyScript: script
});

export const handleChangeTooltip = (patch: Patch, value: Value): Patch => {
  const data = encodeToString({
    ...patch,
    tooltipId: value.tooltipId
  });

  return {
    tooltip: data
  };
};
