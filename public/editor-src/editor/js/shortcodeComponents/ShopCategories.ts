import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { ECWID_CATEGORY_TYPE } from "visual/utils/ecwid";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  const contentDefaults =
    config.contentDefaults?.[ElementTypes.ShopCategories] ?? {};
  const manualId = config?.modules?.shop?.ecwidCategoryTypeId;

  return {
    id: "ShopCategories",
    title: t("Categories"),
    icon: "nc-woo-categories",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--posts", "wrapper-posts-posts"],
        items: [
          {
            type: ElementTypes.Posts,
            value: {
              configId: "ShopCategories",
              _styles: ["posts", "posts-posts"],
              ...config.contentDefaults?.[ElementTypes.Posts],
              ...contentDefaults
            }
          }
        ]
      }
    },
    config: {
      exclude: false,
      includeQueryMultiOptions: false,
      querySource: false,
      manualId,
      collectionFilters: ECWID_CATEGORY_TYPE,
      getIncludeDisabledValue: (source: string) =>
        contentDefaults?.component === ECWID_CATEGORY_TYPE &&
        manualId === source
    }
  };
}
