import { isWp } from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export default function (config: ConfigCommon) {
  return {
    id: "WOOProductPage",
    title: t("Product"),
    icon: "nc-woo-2",
    position: 20,
    hidden: isWp(config) ? !config.wp.plugins.woocommerce : true,
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
}
