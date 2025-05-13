import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "Search",
    title: t("Filters"),
    upgradeMessage: t("You need the Shop Add-on to use this"),
    upgradeActionMessage: t("Get Shop Add-On"),
    icon: "nc-search",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ecwid-search"],
        items: [
          {
            type: ElementTypes.EcwidSearch,
            value: { _styles: ["search"] }
          }
        ]
      }
    }
  };
}
