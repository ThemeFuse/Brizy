import { t } from "visual/utils/i18n";

export default {
  id: "progressBar",
  title: t("Progress"),
  icon: "nc-progress",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--progressBar"],
      items: [
        {
          type: "ProgressBar",
          value: {
            _styles: ["progressBar"]
          }
        }
      ]
    }
  }
};
