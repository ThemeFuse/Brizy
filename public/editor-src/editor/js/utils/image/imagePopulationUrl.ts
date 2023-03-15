import {
  placeholderObjFromStr,
  placeholderObjToStr
} from "visual/editorComponents/EditorComponent/DynamicContent/utils";

interface Options {
  cW: number;
  cH: number;
}

export function imagePopulationUrl(
  population: string,
  options: Options = {
    cW: 5000,
    cH: 0
  }
): string {
  const { cW, cH } = options;

  if (!population || typeof cW !== "number" || typeof cH !== "number") {
    throw new Error("Invalid arguments");
  }

  const placeholder = placeholderObjFromStr(population);

  if (!placeholder) {
    throw new Error("Invalid arguments");
  }

  placeholder.attr = {
    ...placeholder.attr,
    cW,
    cH
  };

  return placeholderObjToStr(placeholder);
}

export default imagePopulationUrl;
