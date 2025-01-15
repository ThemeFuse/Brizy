import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "audio",
    title: t("Audio"),
    icon: "nc-audio",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--audio"],
        items: [
          {
            type: "Audio",
            value: {
              _styles: ["audio"]
            }
          }
        ]
      }
    }
  };
}
