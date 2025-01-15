import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "storyMap",
    title: t("Map"),
    icon: "nc-pin",
    resolve: {
      type: "StoryWrapper",
      value: {
        _styles: ["wrapper--story", "wrapper--story-map"],
        items: [
          {
            type: "Map",
            value: {
              _styles: ["story-map"]
            }
          }
        ]
      }
    }
  };
}
