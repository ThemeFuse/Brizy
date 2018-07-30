import { t } from "visual/utils/i18n";

export default {
  id: "countdown",
  title: t("Countdown"),
  icon: "nc-countdown",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--countdown"],
      items: [
        {
          type: "Countdown",
          value: {
            _styles: ["countdown"]
          }
        }
      ]
    }
  }
};
