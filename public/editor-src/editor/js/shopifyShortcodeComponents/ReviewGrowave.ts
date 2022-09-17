import { t } from "visual/utils/i18n";

export default {
  id: "ReviewGrowave",
  title: t("Reviews by Growave"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-growave-reviews"],
      items: [
        {
          type: "ReviewGrowave",
          value: {
            _styles: ["growave-reviews"]
          }
        }
      ]
    }
  }
};
