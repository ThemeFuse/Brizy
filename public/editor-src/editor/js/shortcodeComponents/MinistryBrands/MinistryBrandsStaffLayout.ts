import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsStaffLayout",
    title: t("Staff Layout"),
    icon: "nc-users-rectangle",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: ElementTypes.MinistryBrandsStaffLayout,
            value: {
              _styles: ["ministryBrandsStaffLayout"]
            }
          }
        ]
      }
    }
  };
}
