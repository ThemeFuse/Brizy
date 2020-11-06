import { t } from "visual/utils/i18n";

export default {
  id: "image",
  title: t("Image"),
  icon: "nc-img",
  resolve: {
    type: "StoryWrapper",
    value: {
      _styles: ["wrapper--story", "wrapper--story-image"],
      items: [
        {
          type: "Image",
          value: {
            _styles: ["story-image"]
          }
        }
      ]
    }
  }
};
