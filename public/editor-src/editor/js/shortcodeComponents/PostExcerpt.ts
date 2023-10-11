import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "PostExcerpt",
    title: t("Excerpt"),
    icon: "nc-wp-post-excerpt",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-postExcerpt"],
        items: [
          {
            type: ElementTypes.PostExcerpt,
            value: {
              _styles: ["postExcerpt"],
              ...config.contentDefaults?.PostExcerpt
            }
          }
        ]
      }
    }
  };
}
