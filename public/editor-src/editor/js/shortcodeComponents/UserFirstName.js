import { t } from "visual/utils/i18n";

export default {
  id: "UserFirstName",
  title: t("First Name"),
  icon: "nc-user-details",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-userFirstName"],
      items: [
        {
          type: "WPPostExcerpt",
          value: {
            type: "userFirstName"
          }
        }
      ]
    }
  }
};
