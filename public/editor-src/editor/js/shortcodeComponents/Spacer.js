import { t } from "visual/utils/i18n";

export default {
  id: "spacer",
  title: t("Spacer"),
  icon: "nc-zoom-e",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--spacer"],
      items: [
        {
          type: "Spacer",
          value: {
            _styles: ["spacer"]
          }
        }
      ]
    }
  }
};
