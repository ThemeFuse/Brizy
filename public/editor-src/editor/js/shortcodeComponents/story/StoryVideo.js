import { t } from "visual/utils/i18n";

export default {
  id: "storyVideo",
  title: t("Video"),
  icon: "nc-play",
  resolve: {
    type: "StoryWrapper",
    value: {
      _styles: ["wrapper--story", "wrapper--story-video"],
      items: [
        {
          type: "Video",
          value: {
            _styles: ["story-video"]
          }
        }
      ]
    }
  }
};
