import { t } from "visual/utils/i18n";

export default {
  id: "UserLastName",
  title: t("Last Name"),
  icon: "nc-user-details",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-userLastName"],
      items: [
        {
          type: "WPPostExcerpt",
          value: {
            type: "userLastName"
          }
        }
      ]
    }
  }
};
