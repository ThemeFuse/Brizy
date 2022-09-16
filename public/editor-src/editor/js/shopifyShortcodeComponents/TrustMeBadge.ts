import { t } from "visual/utils/i18n";

export default {
  id: "TrustMeBadges",
  title: t("Trust Me Badges"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--trust-me-badges"],
      items: [
        {
          type: "TrustMeBadges",
          value: {
            _styles: ["trust-me-badges"]
          }
        }
      ]
    }
  }
};
