import { getFontById } from "visual/utils/fonts";
import * as Weight from "./Weight.ts";
import { weightTitle } from "visual/utils/fonts/i10n";

/**
 * @type {{[number]: string}}
 */
export const weightTypes = Weight.weights.reduce((ws, w) => {
  ws[w] = weightTitle(w);
  return ws;
}, {});

export function getWeightChoices({ type, family }) {
  if (type && family) {
    const { weights } = getFontById({
      type,
      family
    });

    return weights.map(item => ({
      title: weightTitle(item),
      value: item
    }));
  }

  // Returned Default Normal Weight
  return [
    {
      title: weightTitle(Weight.empty),
      value: Weight.empty
    }
  ];
}

export function getWeight(weight, weights) {
  // e.g. [300(selected), 400, 700] -> [400, 700]
  if (weights.includes(Number(weight))) {
    return weight;
  }

  // Returned Default Normal Weight
  return Weight.empty;
}
