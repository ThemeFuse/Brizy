import { t } from "visual/utils/i18n";

export default {
  id: "WPFeaturedImage",
  title: t("Featured Image"),
  icon: "nc-img",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--image"],
      items: [
        {
          type: "Image",
          value: {
            _styles: ["image", "image--dynamic"]
          }
        }
      ]
    }
  }
};
