import { t } from "visual/utils/i18n";

export default function () {
  return {
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
}
