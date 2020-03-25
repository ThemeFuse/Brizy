import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarSizeWidthWidthPercent,
  toolbarElementVideoPlaylistSizeWidthPixel,
  toolbarElementVideoPlaylistItemGrid,
  toolbarDisabledAdvancedSettings
} from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device });

  return [
    {
      id: dvk("toolbarCurrentElement"),
      type: "popover",
      icon: "nc-play",
      title: t("Playlist"),
      position: 10,
      options: [
        {
          id: "positionItem",
          label: t("Position"),
          type: "select-dev",
          devices: "desktop",
          choices: [
            { value: "horizontal", title: "Horizontal" },
            { value: "vertical", title: "Vertical" }
          ]
        },
        {
          id: "positionThumbs",
          label: t("Thumbs"),
          type: "select-dev",
          devices: "desktop",
          disabled: v.positionItem === "horizontal",
          choices: [
            { value: "above", title: "Top" },
            { value: "under", title: "Bottom" }
          ]
        },
        toolbarElementVideoPlaylistItemGrid({
          v,
          device,
          state: "normal",
          disabled: v.positionItem === "horizontal"
        })
      ]
    },
    {
      id: dvk("toolbarColor"),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      devices: "desktop",
      roles: ["admin"],
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(v.borderColorHex)
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    toolbarDisabledAdvancedSettings({ device }),
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
          state: "normal"
        }),
        toolbarElementVideoPlaylistSizeWidthPixel({
          v,
          device,
          state: "normal",
          disabled: v.positionItem === "vertical" || device === "mobile"
        }),
        {
          id: dvk("advancedSettings"),
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}
