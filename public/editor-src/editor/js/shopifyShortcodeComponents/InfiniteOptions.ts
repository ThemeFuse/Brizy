import { t } from "visual/utils/i18n";

export default {
  id: "InfiniteOptions",
  title: t("Infinite Options"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--infite-options"],
      items: [
        {
          type: "InfiniteOptions",
          value: {
            _styles: ["infite-options"]
          }
        }
      ]
    }
  }
};
