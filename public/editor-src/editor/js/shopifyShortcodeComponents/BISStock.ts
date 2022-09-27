import { t } from "visual/utils/i18n";

export default {
  id: "BISStock",
  title: t("Back In Stock"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--bis-stock"],
      items: [
        {
          type: "BISStock",
          value: {
            _styles: ["bis-stock"]
          }
        }
      ]
    }
  }
};
