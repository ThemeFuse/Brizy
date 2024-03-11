import { getPlaceholders, getPlaceholdersData } from "../api";
import { DCHandler } from "../types/DynamicContent";
import { Response } from "../types/Response";
import { Dictionary } from "../types/utils";
import { t } from "../utils/i18n";

export const placeholders: DCHandler = async (res, rej, extraData) => {
  try {
    const placeholders = await getPlaceholders(extraData);

    res(placeholders);
  } catch (e) {
    rej(t("Failed to load dynamic content placeholders"));
  }
};

export async function placeholderData(
  res: Response<Dictionary<string[]>>,
  rej: Response<string>,
  extra: { placeholders: Dictionary<string>; signal?: AbortSignal }
) {
  try {
    const data = await getPlaceholdersData(extra);
    res(data);
  } catch (e) {
    rej(t("Fetch placeholder data error: ") + e);
  }
}
