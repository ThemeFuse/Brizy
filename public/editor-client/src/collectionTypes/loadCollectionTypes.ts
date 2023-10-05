import { ChoicesSync } from "../types/Choices";
import { Response } from "../types/Response";
import { t } from "../utils/i18n";
import { getCollectionTypes } from "./utils";

export const loadCollectionTypes = {
  async handler(res: Response<ChoicesSync>, rej: Response<string>) {
    try {
      const collectionTypes = getCollectionTypes();

      if (!collectionTypes) {
        return rej(t("Missing collectionTypes in config"));
      }

      const items = [{ title: "None", value: "" }, ...collectionTypes];

      res(items);
    } catch (e) {
      rej(t("Failed to load collection types"));
    }
  }
};
