import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "storyButton",
    title: t("Button"),
    icon: "nc-button",
    resolve: {
      type: "StoryWrapper",
      value: {
        _styles: ["wrapper--story", "wrapper--story-button"],
        items: [
          {
            type: "Button",
            value: {
              _styles: ["story-button"]
            }
          }
        ]
      }
    }
  };
}
