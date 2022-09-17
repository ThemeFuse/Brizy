import { t } from "visual/utils/i18n";

export default {
  id: "OnVoard",
  title: t("Notifications by OnVoard"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--onvoard-notifications"],
      items: [
        {
          type: "OnVoard",
          value: {
            _styles: ["onvoard-notifications"]
          }
        }
      ]
    }
  }
};
