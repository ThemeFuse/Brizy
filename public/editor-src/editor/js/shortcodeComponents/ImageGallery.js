import { t } from "visual/utils/i18n";

export default {
  id: "imageGallery",
  title: t("Gallery"),
  icon: "nc-gallery",
  hidden: true,
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--imageGallery"],
      items: [
        {
          type: "ImageGallery",
          value: {
            _styles: ["imageGallery"],
            items: [
              {
                type: "Image",
                value: {
                  _styles: ["image"]
                }
              },
              {
                type: "Image",
                value: {
                  _styles: ["image"]
                }
              }
            ]
          }
        }
      ]
    }
  }
};
