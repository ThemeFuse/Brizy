import {
  placeholderObjFromStr,
  placeholderObjToStr
} from "visual/editorComponents/EditorComponent/DynamicContent/utils";

interface Options {
  cW: number;
  cH: number;
  useCustomPlaceholder: boolean;
}

export const defaultImagePopulation: Options = {
  cW: 5000,
  cH: 0,
  useCustomPlaceholder: false
};

export function imagePopulationUrl(
  population: string,
  options: Options = defaultImagePopulation
): string {
  const { cW, cH, useCustomPlaceholder } = options;

  if (!population || typeof cW !== "number" || typeof cH !== "number") {
    throw new Error("Invalid arguments");
  }

  const placeholder = placeholderObjFromStr(population, useCustomPlaceholder);

  if (!placeholder) {
    throw new Error("Invalid arguments");
  }

  placeholder.attr = {
    ...placeholder.attr,
    cW,
    cH
  };

  return placeholderObjToStr(placeholder, useCustomPlaceholder);
}

export default imagePopulationUrl;
