import { t } from "visual/utils/i18n";

export default {
  id: "MyAccount",
  title: t("My Account"),
  icon: "nc-user",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ecwid-my-account"],
      items: [
        {
          type: "EcwidMyAccount",
          value: { _styles: ["myAccount"] }
        }
      ]
    }
  }
};
