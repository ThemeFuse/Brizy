import { t } from "visual/utils/i18n";

export default {
  id: "WideBundle",
  title: t("WideBundle"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--wide-bundle"],
      items: [
        {
          type: "WideBundle",
          value: {
            _styles: ["wide-bundle"]
          }
        }
      ]
    }
  }
};
