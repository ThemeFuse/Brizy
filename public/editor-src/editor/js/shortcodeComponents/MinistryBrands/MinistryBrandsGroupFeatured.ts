import { t } from "visual/utils/i18n";

export default {
  id: "MinistryBrandsGroupFeatured",
  title: t("Group Featured"),
  icon: "t2-group-featured",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "MinistryBrandsGroupFeatured",
          value: {
            _styles: ["ministryBrandsGroupFeatured"]
          }
        }
      ]
    }
  }
};
