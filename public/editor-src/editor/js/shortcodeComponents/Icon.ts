import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "icon",
    title: t("Icon"),
    icon: "nc-star",
    resolve: {
      type: "Cloneable",
      value: {
        _styles: ["wrapper-clone", "wrapper-clone--icon"],
        items: [
          {
            type: ElementTypes.Icon,
            value: {
              _styles: ["icon"],
              ...config.contentDefaults?.[ElementTypes.Icon]
            }
          }
        ]
      }
    }
  };
}
