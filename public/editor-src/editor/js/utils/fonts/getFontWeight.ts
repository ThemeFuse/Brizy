import { Store } from "visual/redux/store";
import { ModelFamilyType, getFontById } from "visual/utils/fonts/getFontById";
import { weightTitle } from "visual/utils/fonts/i10n";
import * as Weight from "./Weight";

export const getWeightTypes = () => {
  return Weight.weights.reduce(
    (ws, w) => {
      ws[w] = weightTitle(w);
      return ws;
    },
    {} as { [k: string]: string }
  );
};

interface ChoicesData {
  type?: ModelFamilyType;
  family?: string;
  store: Store;
}

export function getWeightChoices(data: ChoicesData) {
  const { type, family, store } = data;

  if (type && family) {
    const { weights } = getFontById({ type, family, store });

    return weights.map((item: number) => ({
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
