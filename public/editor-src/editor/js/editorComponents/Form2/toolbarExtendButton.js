import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarSizeWidthWidthPercent,
  toolbarLinkMessageSuccess,
  toolbarLinkMessageError,
  toolbarLinkMessageRedirect,
  toolbarHorizontalAlign,
  toolbarDisabledAdvancedSettings,
  toolbarDisabledShowOnTablet,
  toolbarDisabledShowOnMobile,
  toolbarElementForm2Apps
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });

  return [
    {
      id: dvk("popoverLink"),
      type: "popover",
      icon: "nc-link",
      title: t("Link"),
      size: "medium",
      position: 90,
      options: [
        {
          id: "linkType",
          type: "tabs",
          tabs: [
            {
              id: "message",
              label: t("Message"),
              options: [
                toolbarLinkMessageSuccess({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                }),
                toolbarLinkMessageError({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                })
              ]
            },
            {
              id: "redirect",
              label: t("Redirect"),
              options: [
                toolbarLinkMessageRedirect({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: dvk("toolbarSettings"),
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        toolbarSizeWidthWidthPercent({
          v,
          device,
          prefix: "submit",
          state: "normal"
        })
      ]
    },
    toolbarHorizontalAlign({ v, device, state: "normal" }),
    toolbarDisabledAdvancedSettings({ device, state: "normal" }),
    toolbarDisabledShowOnTablet({ devices: "responsive" }),
    toolbarDisabledShowOnMobile({ devices: "responsive" }),
    toolbarElementForm2Apps({ v, device, devices: "desktop", state: "normal" })
  ];
}
