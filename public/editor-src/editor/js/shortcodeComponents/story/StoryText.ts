import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "storyText",
    title: t("Text"),
    icon: "nc-font",
    resolve: {
      type: "StoryWrapper",
      value: {
        _styles: ["wrapper--story", "wrapper--story-richText"],
        items: [
          {
            type: "RichText",
            value: {
              _styles: ["story-richText"]
            }
          }
        ]
      }
    }
  };
}
