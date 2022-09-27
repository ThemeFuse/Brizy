import { t } from "visual/utils/i18n";

export default {
  id: "PickyStory",
  title: t("Widgets by PickyStory"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--picky-story"],
      items: [
        {
          type: "PickyStory",
          value: {
            _styles: ["picky-story"]
          }
        }
      ]
    }
  }
};
