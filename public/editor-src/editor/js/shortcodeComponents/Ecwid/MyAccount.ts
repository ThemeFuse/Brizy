import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MyAccount",
    title: t("My Account"),
    upgradeMessage: t("You need the Shop Add-on to use this"),
    upgradeActionMessage: t("Get Shop Add-On"),
    icon: "nc-user",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ecwid-my-account"],
        items: [
          {
            type: ElementTypes.EcwidMyAccount,
            value: { _styles: ["myAccount"] }
          }
        ]
      }
    }
  };
}
