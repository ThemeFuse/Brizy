import { t } from "visual/utils/i18n";

export default {
  id: "MinistryBrandsEventDetail",
  title: t("Event Detail"),
  icon: "t2-event-detail",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "MinistryBrandsEventDetail",
          value: {
            _styles: ["ministryBrandsEventDetail"]
          }
        }
      ]
    }
  }
};
