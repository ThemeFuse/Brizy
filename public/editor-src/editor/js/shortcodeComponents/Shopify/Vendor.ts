import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "Product Vendor",
    title: t("Vendor"),
    icon: "t2-shopify-vendor",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper"],
        items: [
          {
            type: ElementTypes.Vendor,
            value: {
              ...config.contentDefaults?.[ElementTypes.Vendor]
            }
          }
        ]
      }
    }
  };
}
