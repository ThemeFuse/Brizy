import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsStaffDetail",
    title: t("Staff Detail"),
    icon: "t2-staff-detail",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsStaffDetail",
            value: {
              _styles: ["ministryBrandsStaffDetail"]
            }
          }
        ]
      }
    }
  };
}
