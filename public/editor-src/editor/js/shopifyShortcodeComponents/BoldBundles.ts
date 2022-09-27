import { t } from "visual/utils/i18n";

export default {
  id: "BoldBundles",
  title: t("Bundles - by Bold"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--bold-bundle"],
      items: [
        {
          type: "BoldBundles",
          value: {
            _styles: ["bold-bundle"]
          }
        }
      ]
    }
  }
};
