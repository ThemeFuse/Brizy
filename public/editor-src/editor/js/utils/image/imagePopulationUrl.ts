import {
  explodePlaceholder,
  isPlaceholderStart,
  makePlaceholder
} from "visual/utils/dynamicContent";

interface Options {
  cW: number;
  cH: number;
}

export const defaultImagePopulation: Options = {
  cW: 5000,
  cH: 0
};

export function imagePopulationUrl(
  population: string,
  options: Options = defaultImagePopulation
): string {
  const { cW, cH } = options;

  if (!population || typeof cW !== "number" || typeof cH !== "number") {
    throw new Error("Invalid arguments");
  }

  const data = explodePlaceholder(population);

  if (data) {
    const containerAttr = {
      cW: `${cW}`,
      cH: `${cH}`
    };

    if (isPlaceholderStart(data)) {
      return makePlaceholder({
        content: data.content,
        attr: { ...data.attr, ...containerAttr }
      });
    }

    return makePlaceholder({
      content: data.content,
      attr: containerAttr
    });
  }

  throw new Error(
    "Invalid Population, must be {{ placeholder content='{{ some placeholder }}' }}"
  );
}

export default imagePopulationUrl;
