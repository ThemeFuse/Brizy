import { t } from "visual/utils/i18n";
import { SizeType } from "visual/global/Config/types/configs/common";

export default {
  id: "storyImage",
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
            _styles: ["story-image"],
            sizeType: SizeType.original
          }
        }
      ]
    }
  }
};
