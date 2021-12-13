import { t } from "visual/utils/i18n";

export default {
  id: "UserRoles",
  title: t("Roles"),
  icon: "nc-user-roles",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-userRoles"],
      items: [
        {
          type: "WPPostExcerpt",
          value: {
            type: "userRoles"
          }
        }
      ]
    }
  }
};
