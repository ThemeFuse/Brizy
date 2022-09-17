import { t } from "visual/utils/i18n";

export default {
  id: "TrustSeals",
  title: t("Trust Seals"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--trust-seals"],
      items: [
        {
          type: "TrustSeals",
          value: {
            _styles: ["trust-seals"]
          }
        }
      ]
    }
  }
};
