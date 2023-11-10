import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "button",
    title: t("Button"),
    icon: "nc-button",
    resolve: {
      type: "Cloneable",
      value: {
        _styles: ["wrapper-clone", "wrapper-clone--button"],
        items: [
          {
            type: ElementTypes.Button,
            value: {
              _styles: ["button"],
              ...config.contentDefaults?.[ElementTypes.Button]
            }
          }
        ]
      }
    }
  };
}
