import { t } from "visual/utils/i18n";

export default {
  id: "MinistryBrandsGroupDetail",
  title: t("Group Detail"),
  icon: "t2-group-detail",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "MinistryBrandsGroupDetail",
          value: {
            _styles: ["ministryBrandsGroupDetail"]
          }
        }
      ]
    }
  }
};
