import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "columns",
    title: t("Column"),
    icon: "nc-column",
    resolve: {
      type: ElementTypes.Row,
      value: {
        _styles: ["row", "hide-row-borders", "padding-0"],
        items: config.contentDefaults?.[ElementTypes.Column]
      }
    }
  };
}
