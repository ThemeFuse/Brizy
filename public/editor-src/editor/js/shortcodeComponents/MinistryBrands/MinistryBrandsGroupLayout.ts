import { t } from "visual/utils/i18n";

export default {
  id: "MinistryBrandsGroupLayout",
  title: t("Group Layout"),
  icon: "t2-group-layout",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "MinistryBrandsGroupLayout",
          value: {
            _styles: ["ministryBrandsGroupLayout"]
          }
        }
      ]
    }
  }
};
