import { t } from "visual/utils/i18n";

export default {
  id: "SpecialOffers",
  title: t("Special Offers"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--special-offers"],
      items: [
        {
          type: "SpecialOffers",
          value: {
            _styles: ["special-offers"]
          }
        }
      ]
    }
  }
};
