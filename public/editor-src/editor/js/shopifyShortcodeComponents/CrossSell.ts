import { t } from "visual/utils/i18n";

export default {
  id: "CrossSell",
  title: t("CrossSell"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--cross-sell"],
      items: [
        {
          type: "CrossSell",
          value: {
            _styles: ["cross-sell"]
          }
        }
      ]
    }
  }
};
