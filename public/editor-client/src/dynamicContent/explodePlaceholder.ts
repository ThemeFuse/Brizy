import { ExplodePlaceholder } from "../types/DynamicContent";
import { getPlaceholderObj } from "./utils";

export const explodePlaceholder: ExplodePlaceholder = (placeholder) => {
  try {
    const placeholderObj = getPlaceholderObj(placeholder);

    return placeholderObj;
  } catch (e) {
    return undefined;
  }
};
