import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "ProductImage",
    title: t("Image"),
    icon: "nc-img",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--image"],
        items: [
          {
            type: "Image",
            value: {
              _styles: ["image"],
              ...config?.contentDefaults?.[ElementTypes.ShopifyImage]
            }
          }
        ]
      }
    }
  };
}
