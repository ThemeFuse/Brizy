const { t } = global.Brizy;

export default {
  id: "imageGallery",
  title: t("Gallery"),
  icon: "nc-gallery",
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
