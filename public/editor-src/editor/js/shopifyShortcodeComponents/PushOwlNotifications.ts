import { t } from "visual/utils/i18n";

export default {
  id: "PushOwlNotifications",
  title: t("Notifications by PushOwl"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--owl-notifications"],
      items: [
        {
          type: "PushOwlNotifications",
          value: {
            _styles: ["owl-notifications"]
          }
        }
      ]
    }
  }
};
