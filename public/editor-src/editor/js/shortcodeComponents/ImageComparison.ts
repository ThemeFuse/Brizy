import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "imageComparison",
    title: t("Image Compare"),
    icon: "nc-image-comparison",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--imageComparison"],
        items: [
          {
            type: ElementTypes.ImageComparison,
            value: {
              _styles: ["imageComparison"]
            }
          }
        ]
      }
    }
  };
}
