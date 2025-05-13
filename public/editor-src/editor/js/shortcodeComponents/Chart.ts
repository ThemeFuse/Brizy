import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "Chart",
    title: t("Chart"),
    icon: "t2-chart",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper"],
        items: [
          {
            type: ElementTypes.Chart,
            value: {
              _styles: ["chart"]
            }
          }
        ]
      }
    }
  };
}
