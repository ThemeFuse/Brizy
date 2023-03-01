import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarShowOnResponsive } from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  // Don't send items down because they will likely
  // be disabled below as Wrapper uses them itself (see toolbar.js)
  if (dvv("showToolbar") === "on") {
    return [];
  }

  return [
    toolbarShowOnResponsive({
      v,
      device,
      state: "normal",
      devices: "responsive",
      position: 1
    }),
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      position: 100,
      choices: [
        {
          icon: "nc-text-align-left",
          title: t("Align"),
          value: "left"
        },
        {
          icon: "nc-text-align-center",
          title: t("Align"),
          value: "center"
        },
        {
          icon: "nc-text-align-right",
          title: t("Align"),
          value: "right"
        }
      ]
    }
  ];
}
