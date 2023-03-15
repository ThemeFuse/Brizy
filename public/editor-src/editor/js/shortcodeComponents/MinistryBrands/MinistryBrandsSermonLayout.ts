import { t } from "visual/utils/i18n";

export default {
  id: "MinistryBrandsSermonLayout",
  title: t("Sermon Layout"),
  icon: "t2-sermon-layout",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "MinistryBrandsSermonLayout",
          value: {
            _styles: ["ministryBrandsSermonLayout"]
          }
        }
      ]
    }
  }
};
