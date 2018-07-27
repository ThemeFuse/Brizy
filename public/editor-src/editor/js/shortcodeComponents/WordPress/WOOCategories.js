import { t } from "visual/utils/i18n";

export default {
  id: "WOOCategories",
  title: t("Categories"),
  icon: "nc-woo-2",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--WOOCategories"],
      items: [
        {
          type: "WOOCategories"
        }
      ]
    }
  }
};
