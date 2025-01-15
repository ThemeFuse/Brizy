import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "map",
    title: t("Map"),
    icon: "nc-pin",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--map"],
        items: [
          {
            type: "Map",
            value: {
              _styles: ["map"]
            }
          }
        ]
      }
    }
  };
}
