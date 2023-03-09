import { t } from "visual/utils/i18n";

export default {
  id: "MinistryBrandsEventLayout",
  title: t("Event Layout"),
  icon: "t2-event-layout",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "MinistryBrandsEventLayout",
          value: {
            _styles: ["ministryBrandsEventLayout"]
          }
        }
      ]
    }
  }
};
