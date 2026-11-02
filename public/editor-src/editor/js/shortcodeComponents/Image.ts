import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { SizeType } from "visual/global/Config/types/configs/common";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "image",
    title: t("Image"),
    icon: "nc-img",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--image"],
        items: [
          {
            type: ElementTypes.Image,
            value: {
              _styles: ["image"],
              sizeType: SizeType.original,
              ...config.contentDefaults?.[ElementTypes.Image]
            }
          }
        ]
      }
    }
  };
}
