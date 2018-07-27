import { t } from "visual/utils/i18n";

export default {
  id: "text",
  title: t("Text"),
  icon: "nc-font",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--richText"],
      items: [
        {
          type: "RichText",
          value: {
            _styles: ["richText"]
          }
        }
      ]
    }
  }
};
