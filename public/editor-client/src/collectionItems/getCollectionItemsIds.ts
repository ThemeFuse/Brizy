import { getCollectionSourceItems } from "../api";
import { ChoicesSync } from "../types/Choices";
import { Response } from "../types/Response";
import { t } from "../utils/i18n";

export const getCollectionItemsIds = {
  async handler(
    res: Response<ChoicesSync>,
    rej: Response<string>,
    extra: { id: string }
  ) {
    try {
      const data = await getCollectionSourceItems(extra.id);

      const items = [
        { title: t("None"), value: "" },
        ...data.posts.map(({ ID, title }: { ID: string; title: string }) => ({
          value: `${ID}`,
          title
        }))
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
