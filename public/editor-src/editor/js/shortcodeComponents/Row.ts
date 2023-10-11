import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "row",
    title: t("Row"),
    icon: "nc-row",
    resolve: {
      type: ElementTypes.Row,
      value: {
        _styles: ["row"],
        ...config.contentDefaults?.[ElementTypes.Row]
      }
    }
  };
}
