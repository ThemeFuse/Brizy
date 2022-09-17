import { t } from "visual/utils/i18n";

export default {
  id: "ReferralCandy",
  title: t("Notifications by ReferralCandy"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--referral-candy"],
      items: [
        {
          type: "ReferralCandy",
          value: {
            _styles: ["referral-candy"]
          }
        }
      ]
    }
  }
};
