import { getCollectionSourceItems } from "../api";
import { ChoicesSync } from "../types/Choices";
import { Response } from "../types/Response";
import { t } from "../utils/i18n";

export const getCollectionItems = {
  async handler(
    res: Response<ChoicesSync>,
    rej: Response<string>,
    extra: { id: string; extraChoices?: ChoicesSync; search?: string }
  ) {
    try {
      const { id, extraChoices, search = "" } = extra;
      const data = await getCollectionSourceItems(id, search);

      const items = [
        ...(extraChoices ?? []),
        ...data.posts.map(
          ({
            ID,
            title,
            permalink
          }: {
            ID: string;
            title: string;
            permalink: string;
          }) => ({
            value: `${ID}`,
            title,
            populationPermalink: permalink
          })
        )
      ];

      res(items);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error(e);
      }

      rej(t("Something went wrong"));
    }
  }
};
