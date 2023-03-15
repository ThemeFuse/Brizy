import { t } from "visual/utils/i18n";

export default {
  id: "MinistryBrandsGroupList",
  title: t("Group List"),
  icon: "t2-group-list",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "MinistryBrandsGroupList",
          value: {
            _styles: ["ministryBrandsGroupList"]
          }
        }
      ]
    }
  }
};
