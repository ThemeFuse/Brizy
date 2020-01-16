import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
const wp = Config.get("wp");

export default {
  id: "WOOProductPage",
  title: t("Product"),
  icon: "nc-woo-2",
  position: 20,
  hidden: !wp.plugins.woocommerce,
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--WOOProductPage"],
      items: [
        {
          type: "WOOProductPage"
        }
      ]
    }
  }
};
