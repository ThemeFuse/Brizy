import { t } from "visual/utils/i18n";

export default {
  id: "MinistryBrandsSermonFeatured",
  title: t("Sermon Featured"),
  icon: "t2-sermon-featured",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "MinistryBrandsSermonFeatured",
          value: {
            _styles: ["ministryBrandsSermonFeatured"]
          }
        }
      ]
    }
  }
};
