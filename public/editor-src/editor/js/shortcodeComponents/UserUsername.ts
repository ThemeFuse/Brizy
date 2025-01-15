import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "UserUsername",
    title: t("Username"),
    icon: "nc-user-details",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-userUsername"],
        items: [
          {
            type: "WPPostExcerpt",
            value: {
              type: "userUsername"
            }
          }
        ]
      }
    }
  };
}
