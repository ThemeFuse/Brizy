import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "Favorites",
    title: t("Favorites"),
    upgradeMessage: t("You need the Shop Add-on to use this"),
    upgradeActionMessage: t("Get Shop Add-On"),
    icon: "nc-save-section",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ecwid-favorites"],
        items: [
          {
            type: ElementTypes.EcwidFavorites,
            value: { _styles: ["ecwid-favorites"] }
          }
        ]
      }
    }
  };
}
