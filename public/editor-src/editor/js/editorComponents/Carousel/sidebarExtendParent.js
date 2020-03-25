import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";

import {
  toolbarDisabledPadding,
  toolbarElementCarouselPadding,
  toolbarCustomCSS
} from "visual/utils/toolbar";

export const title = t("Carousel");

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  return [
    toolbarDisabledPadding({
      device,
      devices: "responsive",
      state: "normal"
    }),
    toolbarElementCarouselPadding({
      v,
      device,
      devices: "responsive",
      state: "normal"
    }),
    {
      id: dvk("settingsTabs"),
      type: "tabs",
      align: "start",
      tabs: [
        {
          id: dvk("settingsStyling"),
          label: t("Styling"),
          tabIcon: "nc-styling",
          options: [
            toolbarDisabledPadding({
              device,
              devices: "desktop",
              state: "normal"
            }),
            toolbarElementCarouselPadding({
              v,
              device,
              devices: "desktop",
              state: "normal"
            })
          ]
        },
        {
          id: dvk("moreSettingsAdvanced"),
          label: t("Advanced"),
          tabIcon: "nc-cog",
          options: [
            toolbarCustomCSS({
              v,
              device,
              state: "normal",
              devices: "desktop"
            })
          ]
        }
      ]
    }
  ];
}
