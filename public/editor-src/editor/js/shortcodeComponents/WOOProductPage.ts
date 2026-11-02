import { isWp } from "visual/global/Config";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { t } from "visual/utils/i18n";

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
