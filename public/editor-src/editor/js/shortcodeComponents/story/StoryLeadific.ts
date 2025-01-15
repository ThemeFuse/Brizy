import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "storyLeadific",
    title: t("Leadific"),
    icon: "nc-leadific",
    resolve: {
      type: "StoryWrapper",
      value: {
        _styles: ["wrapper--story"],
        items: [
          {
            type: ElementTypes.Leadific,
            value: {
              _styles: ["story-leadific"]
            }
          }
        ]
      }
    }
  };
}
