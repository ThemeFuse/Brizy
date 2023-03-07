import { t } from "visual/utils/i18n";

export default {
  id: "MinistryBrandsSermonList",
  title: t("Sermon List"),
  icon: "t2-sermon-list",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "MinistryBrandsSermonList",
          value: {
            _styles: ["ministryBrandsSermonList"]
          }
        }
      ]
    }
  }
};
