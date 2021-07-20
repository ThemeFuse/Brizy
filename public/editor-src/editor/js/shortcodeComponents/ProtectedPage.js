import { t } from "visual/utils/i18n";

export default {
  id: "ProtectedPage",
  title: t("ProtectedPage"),
  icon: "nc-lock",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--protected-page"],
      items: [
        {
          type: "ProtectedPage",
          value: {
            items: [
              {
                type: "Button",
                value: {
                  _styles: ["button", "submit"]
                }
              }
            ]
          }
        }
      ]
    }
  }
};
