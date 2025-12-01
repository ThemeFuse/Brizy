import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsStaffList",
    title: t("Staff List"),
    icon: "t2-staff-list",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: ElementTypes.MinistryBrandsStaffList,
            value: {
              _styles: ["ministryBrandsStaffList"]
            }
          }
        ]
      }
    }
  };
}
