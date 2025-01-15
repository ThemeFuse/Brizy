import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "imageTest",
    title: t("Image Test"),
    icon: "nc-img",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--image-test"],
        items: [
          {
            type: "ImageTest",
            value: {
              _styles: ["imageTest"]
            }
          }
        ]
      }
    }
  };
}
