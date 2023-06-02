import { getCollections } from "../api";
import { getConfig } from "../config";
import { Response } from "../types/Response";
import { t } from "../utils/i18n";
import { read } from "../utils/reader/string";

interface ChoiceWithPermalink {
  id: string;
  title: string;
  permalink?: string;
}

export const searchCollectionItems = {
  async handler(
    res: Response<ChoiceWithPermalink[]>,
    rej: Response<string>,
    { collectionId, search }: { collectionId: string; search: string }
  ) {
    try {
      const config = getConfig();

      if (!config) {
        throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
      }

      const items = await getCollections(
        { search, postType: [collectionId] },
        config
      );

      const _items = items
        .filter((item) => read(item.ID))
        .map(({ title, permalink, ID }) => {
          return {
            title,
            permalink,
            id: String(ID)
          };
        });

      res(_items);
    } catch (e) {
      rej(t("Something went wrong"));
    }
  }
};
