import { MakePlaceholder } from "../types/DynamicContent";
import { getPlaceholder } from "./utils";

export const makePlaceholder: MakePlaceholder = (placeholderObj) => {
  try {
    const placeholder = getPlaceholder(placeholderObj);

    return placeholder;
  } catch (e) {
    return undefined;
  }
};
