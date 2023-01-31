import { t } from "visual/utils/i18n";

export default {
  id: "EventCalendar",
  title: t("Event Calendar"),
  icon: "t2-event-calendar",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "EventCalendar",
          value: {
            _styles: ["EventCalendar"]
          }
        }
      ]
    }
  }
};
