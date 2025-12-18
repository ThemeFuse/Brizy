import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "text",
    title: t("Text"),
    icon: "nc-font",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--richText"],
        items: [
          {
            type: ElementTypes.RichText,
            value: {
              _styles: ["richText"],
              _version: 3,
              ...config.contentDefaults?.[ElementTypes.RichText]
            }
          }
        ]
      }
    }
  };
}
