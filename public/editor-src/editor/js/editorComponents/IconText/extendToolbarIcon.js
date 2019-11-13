import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarElementIconTextIconPosition,
  toolbarElementIconTextIconSpacing,
  toolbarDisabledLink,
  toolbarElementIconDisabledSettings,
  toolbarDisabledHorizontalAlign,
  toolbarDisabledShowOnResponsive,
  toolbarDisabledAdvancedSettings
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  return [
    {
      id: defaultValueKey({
        key: "toolbarCurrentShortcode",
        device,
        state: "normal"
      }),
      type: "popover",
      devices: "desktop",
      icon: "nc-star",
      position: 70,
      options: [
        {
          id: defaultValueKey({
            key: "currentShortcodeTabs",
            device,
            state: "normal"
          }),
          className: "",
          type: "tabs",
          tabs: [
            {
              id: defaultValueKey({
                key: "currentShortcodeTab",
                device,
                state: "normal"
              }),
              label: t("Icon"),
              options: [
                toolbarElementIconTextIconSpacing({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                })
              ]
            }
          ]
        }
      ]
    },
    toolbarElementIconTextIconPosition({
      v,
      device,
      devices: "desktop",
      state: "normal"
    }),
    toolbarDisabledLink({
      v,
      device,
      state: "normal"
    }),
    toolbarElementIconDisabledSettings({
      v,
      device,
      devices: "responsive",
      state: "normal"
    }),
    toolbarDisabledHorizontalAlign({
      v,
      device,
      state: "normal"
    }),
    toolbarDisabledShowOnResponsive({
      device
    }),
    toolbarDisabledAdvancedSettings({ device })
  ];
}
