import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsPrayerWidget",
    title: t("Prayer Widget"),
    icon: "nc-form-left",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: ElementTypes.MinistryBrandsPrayerWidget,
            value: {
              _styles: ["ministryBrandsPrayerWidget"]
            }
          }
        ]
      }
    }
  };
}
