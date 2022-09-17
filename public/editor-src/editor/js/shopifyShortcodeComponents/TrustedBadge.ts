import { t } from "visual/utils/i18n";

export default {
  id: "TrustedBadge",
  title: t("Badge - Trusted"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-trusted-badge"],
      items: [
        {
          type: "TrustedBadge",
          value: {
            _styles: ["trusted-badge"]
          }
        }
      ]
    }
  }
};
