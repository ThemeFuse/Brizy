import { t } from "visual/utils/i18n";
import { toolbarBorderRadius } from "visual/utils/toolbar";
export const title = t("Add To Cart Input");

export function getItems({ v, device }) {
  return [
    {
      id: "settingsTabs",
      type: "tabs-dev",
      config: {
        align: "start"
      },
      devices: "desktop",
      tabs: [
        {
          id: "settingsStyling",
          label: t("Styling"),
          icon: "nc-styling",
          options: [
            toolbarBorderRadius({
              v,
              device,
              prefix: "input",
              state: "normal",
              devices: "desktop",
              position: 70,
              onChangeGrouped: ["onChangeBorderRadiusGrouped"],
              onChangeUngrouped: ["onChangeBorderRadiusUngrouped"]
            })
          ]
        }
      ]
    }
  ];
}
