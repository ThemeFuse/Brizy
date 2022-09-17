import { t } from "visual/utils/i18n";

export default {
  id: "UnlimitedBundles",
  title: t("Unlimited Bundles"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--unlimited-bundles"],
      items: [
        {
          type: "UnlimitedBundles",
          value: {
            _styles: ["unlimited-bundles"]
          }
        }
      ]
    }
  }
};
