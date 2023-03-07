import { t } from "visual/utils/i18n";

export default {
  id: "MinistryBrandsEventCalendar",
  title: t("Event Calendar"),
  icon: "t2-event-calendar",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "MinistryBrandsEventCalendar",
          value: {
            _styles: ["ministryBrandsEventCalendar"]
          }
        }
      ]
    }
  }
};
