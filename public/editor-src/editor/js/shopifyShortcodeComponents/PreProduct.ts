import { t } from "visual/utils/i18n";

export default {
  id: "PreProduct",
  title: t("Product Review"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--pre-product"],
      items: [
        {
          type: "PreProduct",
          value: {
            _styles: ["pre-product"]
          }
        }
      ]
    }
  }
};
