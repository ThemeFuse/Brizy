import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "BlogPostExcerpt",
    title: t("Excerpt"),
    icon: "nc-wp-post-excerpt",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-postExcerpt"],
        items: [
          {
            type: "WPPostExcerpt",
            value: {
              _styles: ["blogPostExcerpt"],
              ...config.contentDefaults?.[ElementTypes.BlogPostExcerpt]
            }
          }
        ]
      }
    }
  };
}
