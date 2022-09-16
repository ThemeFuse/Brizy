import { t } from "visual/utils/i18n";

export default {
  id: "MarselloMarketing",
  title: t("Marketing by Marsello"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--marsello-marketing"],
      items: [
        {
          type: "MarselloMarketing",
          value: {
            _styles: ["marsello-marketing"]
          }
        }
      ]
    }
  }
};
