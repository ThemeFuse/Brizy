import { t } from "visual/utils/i18n";

export default {
  id: "countdown2",
  title: t("Countdown"),
  icon: "nc-countdown",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--countdown2"],
      items: [
        {
          type: "Countdown2",
          value: {
            _styles: ["countdown2"]
          }
        }
      ]
    }
  }
};
