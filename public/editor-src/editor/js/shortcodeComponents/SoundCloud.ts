import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "soundCloud",
    title: t("SoundCloud"),
    icon: "nc-sound-cloud",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--soundCloud"],
        items: [
          {
            type: "SoundCloud",
            value: {
              _styles: ["soundCloud"]
            }
          }
        ]
      }
    }
  };
}
