import { t } from "visual/utils/i18n";

export default {
  id: "BoldProduct",
  title: t("Product Options by Bold"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--bold-options"],
      items: [
        {
          type: "BoldProduct",
          value: {
            _styles: ["bold-options"]
          }
        }
      ]
    }
  }
};
