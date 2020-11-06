import { t } from "visual/utils/i18n";

export default {
  id: "storyCounter",
  title: t("Counter"),
  icon: "nc-counter-outline",
  resolve: {
    type: "StoryWrapper",
    value: {
      _styles: ["wrapper--story ", "wrapper--story-counter"],
      items: [
        {
          type: "Counter",
          value: {
            _styles: ["story-counter"]
          }
        }
      ]
    }
  }
};
