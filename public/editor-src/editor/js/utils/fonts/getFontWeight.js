import _ from "underscore";
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

export function getWeightChoices(font) {
  let newWeights = [400];
  if (font) {
    const { weights = newWeights } = getFontById(font);
    newWeights = weights;
  }


  return _.map(newWeights, item => {
    return {
      title: weightTypes[item],
      value: item
    };
  });
}

export function getWeight(currentWeight, newFont) {

  const { weights: newFontWeights = null } = getFontById(newFont) || {};
  const newHasCurrent = newFontWeights.indexOf( Number(currentWeight) )  !== -1;

  // e.g. [300(selected), 400, 700] -> [400, 700]
  if (newHasCurrent) {
    return currentWeight;
  }

  return 400;
}
