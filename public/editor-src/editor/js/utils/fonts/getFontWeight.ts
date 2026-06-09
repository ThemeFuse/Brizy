import { Num, Str } from "@brizy/readers";
import { Store } from "visual/redux/store";
import { ModelFamilyType, getFontById } from "visual/utils/fonts/getFontById";
import { weightTitle } from "visual/utils/fonts/i10n";
import { t } from "../i18n";
import { Literal } from "../types/Literal";
import * as Weight from "./Weight";

// Encoding for italic weights: italic weight = base weight + 10000
const ITALIC_WEIGHT_OFFSET = 10000;

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

  // Return default weight if type or family is missing
  if (!type || !family) {
    return [
      {
        title: weightTitle(Weight.empty),
        value: Weight.empty
      }
    ];
  }

  const { weights } = getFontById({ type, family, store });

  return weights.map((item: Literal) => {
    const isItalic = Str.is(item) && item.includes("italic");

    // Normalize weight value
    let normalisedWeight: number;
    if (isItalic) {
      // Handle italic variants: "700italic" becomes 700
      normalisedWeight = parseInt(item.replace("italic", ""), 10);
    } else {
      // Parse numeric weight, default to 400 if invalid
      normalisedWeight = Num.read(item) ?? 400;
    }

    // Build title with italic suffix if needed
    const baseTitle = weightTitle(normalisedWeight);
    const title = isItalic ? `${baseTitle} ${t("Italic")}` : baseTitle;

    // Encode weight with italic flag
    const value = encodeWeight(normalisedWeight, isItalic);

    return {
      title,
      value
    };
  });
}

// Helper function to decode italic weight
export function decodeWeight(encodedWeight: number): {
  weight: number;
  isItalic: boolean;
} {
  if (encodedWeight >= ITALIC_WEIGHT_OFFSET) {
    return {
      weight: encodedWeight - ITALIC_WEIGHT_OFFSET,
      isItalic: true
    };
  }
  return {
    weight: encodedWeight,
    isItalic: false
  };
}

// Helper function to encode weight with italic flag
export function encodeWeight(weight: number, isItalic: boolean): number {
  return isItalic ? weight + ITALIC_WEIGHT_OFFSET : weight;
}
