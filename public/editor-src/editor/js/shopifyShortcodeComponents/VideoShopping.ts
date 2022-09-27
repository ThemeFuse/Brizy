import { t } from "visual/utils/i18n";

export default {
  id: "VideoShopping",
  title: t("Video Shopping"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--video-shopping"],
      items: [
        {
          type: "VideoShopping",
          value: {
            _styles: ["video-shopping"]
          }
        }
      ]
    }
  }
};
