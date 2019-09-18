import { t } from "visual/utils/i18n";
import {
  toolbarElementImageGalleryGridColumn,
  toolbarElementImageGallerySpacing,
  toolbarElementImageGalleryLightBox,
  toolbarCustomCSS
} from "visual/utils/toolbar";
import { defaultValueKey } from "visual/utils/onChange";

export function getItems({ v, device }) {
  return [
    {
      id: defaultValueKey({ key: "toolbarGallery", device, state: "normal" }),
      type: "popover",
      icon: "nc-gallery",
      title: t("Gallery"),
      position: 80,
      options: [
        toolbarElementImageGalleryGridColumn({ v, device, state: "normal" }),
        toolbarElementImageGallerySpacing({ v, device, state: "normal" }),
        toolbarElementImageGalleryLightBox({
          v,
          device,
          state: "normal",
          devices: "desktop"
        })
      ]
    },
    {
      id: defaultValueKey({ key: "advancedSettings", device, state: "normal" }),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      icon: "nc-cog",
      options: [
        {
          id: "settingsTabs",
          type: "tabs",
          align: "start",
          tabs: [
            {
              id: defaultValueKey({
                key: "moreSettingsAdvanced",
                device,
                state: "normal"
              }),
              label: t("Advanced"),
              tabIcon: "nc-cog",
              options: []
            }
          ]
        }
      ]
    }
  ];
}
