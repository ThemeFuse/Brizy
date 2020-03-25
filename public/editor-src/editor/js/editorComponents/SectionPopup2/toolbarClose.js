import { t } from "visual/utils/i18n";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import {
  toolbarContainerPopup2CloseBorderRadius,
  toolbarContainerPopup2CloseCustomSize,
  toolbarContainerPopup2CloseBgSize,
  toolbarContainerPopup2CloseHorizontalPosition,
  toolbarContainerPopup2CloseVerticalPosition
} from "visual/utils/toolbar";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: closeColorHex } = getOptionColorHexByPalette(
    dvv("closeColorHex"),
    dvv("closeColorPalette")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
      position: 70,
      options: [
        {
          id: "toolbarCurrentElementTabs",
          type: "tabs",
          tabs: [
            {
              id: "toolbarCurrentElementTabClose",
              label: t("Icon"),
              options: [
                toolbarContainerPopup2CloseHorizontalPosition({
                  v,
                  device,
                  state: "normal"
                }),
                toolbarContainerPopup2CloseVerticalPosition({
                  v,
                  device,
                  state: "normal"
                }),
                toolbarContainerPopup2CloseCustomSize({
                  v,
                  device,
                  state: "normal"
                })
              ]
            },
            {
              id: "toolbarCurrentElementTabBackground",
              label: t("Background"),
              options: [
                toolbarContainerPopup2CloseBgSize({
                  v,
                  device,
                  state: "normal"
                }),
                toolbarContainerPopup2CloseBorderRadius({
                  v,
                  device,
                  state: "normal"
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: dvk("toolbarColor"),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(closeColorHex, dvv("closeColorOpacity"))
        }
      },
      options: [
        {
          id: dvk("tabsColor"),
          type: "tabs",
          tabs: [
            {
              id: dvk("tabIcon"),
              label: t("Icon"),
              options: [
                {
                  id: "closeColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: dvk("tabBackground"),
              label: t("Background"),
              options: [
                {
                  id: "closeBgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "closePosition",
      type: "toggle-dev",
      position: 100,
      choices: [
        {
          icon: "nc-position-in",
          value: "inside"
        },
        {
          icon: "nc-position-out",
          value: "outside"
        }
      ]
    },
    {
      id: "closeAlign",
      type: "toggle-dev",
      position: 100,
      choices: [
        {
          icon: "nc-align-top-left",
          value: "topLeft"
        },
        {
          icon: "nc-align-top-right",
          value: "topRight"
        },
        {
          icon: "nc-align-bottom-right",
          value: "bottomRight"
        },
        {
          icon: "nc-align-bottom-left",
          value: "bottomLeft"
        }
      ]
    }
  ];
}
