import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "UserPhoneNumber",
    title: t("Phone Number"),
    icon: "nc-user-phone-number",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-userPhoneNumber"],
        items: [
          {
            type: "WPPostExcerpt",
            value: {
              type: "userPhoneNumber"
            }
          }
        ]
      }
    }
  };
}
