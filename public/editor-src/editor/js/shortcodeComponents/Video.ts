import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "video",
    title: t("Video"),
    icon: "nc-play",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--video"],
        items: [
          {
            type: "Video",
            value: {
              _styles: ["video"]
            }
          }
        ]
      }
    }
  };
}
