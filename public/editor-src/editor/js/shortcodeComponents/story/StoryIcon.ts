import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "storyIcon",
    title: t("Icon"),
    icon: "nc-star",
    resolve: {
      type: "StoryWrapper",
      value: {
        _styles: ["wrapper--story", "wrapper--story-icon"],
        items: [
          {
            type: "Icon",
            value: {
              _styles: ["story-icon"]
            }
          }
        ]
      }
    }
  };
}
