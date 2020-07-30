import { t } from "visual/utils/i18n";

export default {
  id: "image2",
  title: t("Image2"),
  icon: "nc-img",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--image"],
      items: [
        {
          type: "Image2",
          value: {
            _styles: ["image"]
          }
        }
      ]
    }
  }
};
