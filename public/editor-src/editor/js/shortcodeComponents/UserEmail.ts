import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "UserEmail",
    title: t("Email"),
    icon: "nc-user-email",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-userEmail"],
        items: [
          {
            type: "WPPostExcerpt",
            value: {
              type: "userEmail"
            }
          }
        ]
      }
    }
  };
}
