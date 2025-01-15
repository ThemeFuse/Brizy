import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "storyEmbedCode",
    title: t("Embed"),
    icon: "nc-iframe",
    resolve: {
      type: "StoryWrapper",
      value: {
        _styles: ["wrapper--story", "wrapper--story-embedCode"],
        items: [
          {
            type: "EmbedCode",
            value: {
              _styles: ["story-embedCode"]
            }
          }
        ]
      }
    }
  };
}
