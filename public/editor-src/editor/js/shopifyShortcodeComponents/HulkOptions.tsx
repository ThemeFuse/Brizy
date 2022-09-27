import { t } from "visual/utils/i18n";

export default {
  id: "HulkOptions",
  title: t("Options by Hulk"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--hulk-options"],
      items: [
        {
          type: "HulkOptions",
          value: {
            _styles: ["hulk-options"]
          }
        }
      ]
    }
  }
};
