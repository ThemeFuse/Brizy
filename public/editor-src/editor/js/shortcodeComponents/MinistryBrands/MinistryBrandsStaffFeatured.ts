import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsStaffFeatured",
    title: t("Staff Featured"),
    icon: "t2-staff-featured",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsStaffFeatured",
            value: {
              _styles: ["ministryBrandsStaffFeatured"]
            }
          }
        ]
      }
    }
  };
}
