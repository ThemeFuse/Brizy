import { getFontById } from "visual/utils/fonts";

export const weightTypes = {
  100: "Thin",
  200: "Extra Light",
  300: "Light",
  400: "Normal",
  500: "Medium",
  600: "Semi Bold",
  700: "Bold",
  800: "Extra Bold",
  900: "Black"
};

export function getWeightChoices({ type, family }) {
  if (type && family) {
    const { weights } = getFontById({
      type,
      family
    });

    return weights.map(item => ({
      title: weightTypes[item],
      value: item
    }));
  }

  // Returned Default Normal Weight
  return [
    {
      title: "Normal",
      value: 400
    }
  ];
}

export function getWeight(weight, weights) {
  // e.g. [300(selected), 400, 700] -> [400, 700]
  if (weights.includes(Number(weight))) {
    return weight;
  }

  // Returned Default Normal Weight
  return 400;
}
