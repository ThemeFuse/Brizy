import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "storyLine",
    title: t("Line"),
    icon: "nc-divider",
    resolve: {
      type: "StoryWrapper",
      value: {
        _styles: ["wrapper--story", "wrapper--story-line"],
        items: [
          {
            type: "Line",
            value: {
              _styles: ["story-line"]
            }
          }
        ]
      }
    }
  };
}
