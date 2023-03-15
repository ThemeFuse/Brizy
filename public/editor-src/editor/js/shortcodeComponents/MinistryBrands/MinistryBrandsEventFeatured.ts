import { t } from "visual/utils/i18n";

export default {
  id: "MinistryBrandsEventFeatured",
  title: t("Event Featured"),
  icon: "t2-event-featured",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "MinistryBrandsEventFeatured",
          value: {
            _styles: ["ministryBrandsEventFeatured"]
          }
        }
      ]
    }
  }
};
