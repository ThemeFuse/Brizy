import { t } from "visual/utils/i18n";

export default {
  id: "EventLayout",
  title: t("Event Layout"),
  icon: "t2-event-layout",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ministryBrands"],
      items: [
        {
          type: "EventLayout",
          value: {
            _styles: ["EventLayout"]
          }
        }
      ]
    }
  }
};
