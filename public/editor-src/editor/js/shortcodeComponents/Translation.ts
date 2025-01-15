import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "translation",
    title: t("Translation"),
    icon: "nc-multi-languages",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--translation"],
        items: [
          {
            type: "Translation",
            value: {
              _styles: ["translation"]
            }
          }
        ]
      }
    }
  };
}
