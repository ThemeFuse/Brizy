import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "storyProgressBar",
    title: t("Progress"),
    icon: "nc-progress-bar",
    resolve: {
      type: "StoryWrapper",
      value: {
        _styles: ["wrapper--story", "wrapper--story-progressBar"],
        items: [
          {
            type: "ProgressBar",
            value: {
              _styles: ["story-progressBar"]
            }
          }
        ]
      }
    }
  };
}
