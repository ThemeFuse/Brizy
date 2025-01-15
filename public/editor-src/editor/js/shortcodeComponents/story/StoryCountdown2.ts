import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "storyCountdown2",
    title: t("Countdown"),
    icon: "nc-countdown",
    resolve: {
      type: "StoryWrapper",
      value: {
        _styles: ["wrapper--story-countdown2"],
        items: [
          {
            type: "Countdown2",
            value: {
              _styles: ["story-countdown2"]
            }
          }
        ]
      }
    }
  };
}
