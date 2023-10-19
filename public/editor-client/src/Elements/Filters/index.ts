import { getFields } from "../../api";
import { Filters } from "../../types/Filters";
import { t } from "../../utils/i18n";
import { converter, parseFields } from "./utils";

export const handler: Filters["handler"] = async (res, rej, data) => {
  try {
    const result = await getFields(data);

    const convertedValue = converter(result);

    res(convertedValue ?? []);
  } catch (e) {
    rej(t("Failed to load sources"));
  }
};

export const possibleValues: Filters["possibleValues"] = async (
  res,
  rej,
  { type, search, optionSource, postId, loopAttributes }
) => {
  try {
    const result = await getFields({ postId, loopAttributes });

    const convertPossibleValues = parseFields(
      result,
      optionSource,
      type,
      search
    );

    res(convertPossibleValues ?? []);
  } catch (e) {
    rej(t("Failed to load sources"));
  }
};
