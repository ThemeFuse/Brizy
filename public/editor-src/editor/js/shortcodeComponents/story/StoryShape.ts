import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "storyShape",
    title: t("Shape"),
    icon: "nc-shape",
    resolve: {
      type: "StoryWrapper",
      value: {
        _styles: ["wrapper--story", "wrapper--story-shape"],
        items: [
          {
            type: "Shape",
            value: {
              _styles: ["story-shape"]
            }
          }
        ]
      }
    }
  };
}
