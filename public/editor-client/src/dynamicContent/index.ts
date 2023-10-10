import { getPlaceholders } from "../api";
import { DCHandler } from "../types/DynamicContent";
import { t } from "../utils/i18n";

export const placeholders: DCHandler = async (res, rej, extraData) => {
  try {
    const placeholders = await getPlaceholders(extraData);

    res(placeholders);
  } catch (e) {
    rej(t("Failed to load dynamic content placeholders"));
  }
};
