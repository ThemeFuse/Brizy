import { setIn } from "timm";
import { isObject } from "visual/utils/reader/object";
import { capByPrefix, encodeToString } from "visual/utils/string";

interface Value {
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
}

type Patch = Partial<Value>;

export const handleChangeLink = (v: Value, value: Patch) => ({
  link: encodeToString({
    type: v.linkType,
    anchor: v.linkAnchor ? `#${v.linkAnchor}` : "",
    external: value.linkExternal ?? v.linkExternal,
    externalBlank: value.linkExternalBlank ?? v.linkExternalBlank,
    externalRel: value.linkExternalRel ?? v.linkExternalRel,
    externalType: value.linkPopulation ? "population" : "external",
    population: value.linkPopulation ?? v.linkPopulation,
    popup: v.linkPopup ? `#${v.linkPopup}` : "",
    upload: v.linkUpload,
    linkToSlide: v.linkToSlide
  })
});

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
    const paletteValue = setIn(
      populationColor,
      [type, "colorPalette"],
      value[palette]
    );

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
