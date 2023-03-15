import { t } from "visual/utils/i18n";

export default {
  id: "MinistryBrandsSermonDetail",
  title: t("Sermon Detail"),
  icon: "t2-sermon-detail",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "MinistryBrandsSermonDetail",
          value: {
            _styles: ["ministryBrandsSermonDetail"]
          }
        }
      ]
    }
  }
};
