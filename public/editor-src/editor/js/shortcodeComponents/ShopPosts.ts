import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { ECWID_PRODUCT_TYPE } from "visual/utils/ecwid";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  const contentDefaults =
    config.contentDefaults?.[ElementTypes.ShopPosts] ?? {};
  const manualId = config?.modules?.shop?.ecwidProductTypeId;

  return {
    id: "ShopPosts",
    title: t("Products"),
    icon: "nc-woo-products",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--posts", "wrapper-posts-posts"],
        items: [
          {
            type: ElementTypes.Posts,
            value: {
              configId: "ShopPosts",
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
      collectionFilters: ECWID_PRODUCT_TYPE,
      getIncludeDisabledValue: (source: string) =>
        contentDefaults?.component === ECWID_PRODUCT_TYPE && manualId === source
    }
  };
}
