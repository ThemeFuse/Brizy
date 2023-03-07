import { t } from "visual/utils/i18n";

export default {
  id: "MinistryBrandsEventList",
  title: t("Event List"),
  icon: "t2-event-list",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "MinistryBrandsEventList",
          value: {
            _styles: ["ministryBrandsEventList"]
          }
        }
      ]
    }
  }
};
