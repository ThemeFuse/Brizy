import { getConfig } from "../../config";
import { CollectionType } from "../../types/Collections";
import { Posts } from "../../types/Posts";
import { t } from "../../utils/i18n";

export const handler: Posts["handler"] = async (res, rej) => {
  try {
    const config = getConfig();

    const src = config?.collectionTypes.map(
      ({ name, label, orderBy }: CollectionType) => ({
        id: name,
        title: label,
        orderBy: orderBy.map((orderItem) => ({
          title: orderItem.label,
          id: orderItem.field
        }))
      })
    );

    res({
      sources: src ?? [],
    });
  } catch (e) {
    rej(t("Failed to load sources"));
  }
};
