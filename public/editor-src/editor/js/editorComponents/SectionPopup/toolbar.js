import { hexToRgba } from "visual/utils/color";
import {
  getOptionColorHexByPalette,
  getDynamicContentChoices
} from "visual/utils/options";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import {
  toolbarElementSectionSaved,
  toolbarElementSectionGlobal
} from "visual/utils/toolbar";
import { NORMAL, HOVER } from "visual/utils/stateMode";
import { DCTypes } from "visual/global/Config/types/DynamicContent";

export function getItems({ v, device, component, context }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const imageDynamicContentChoices = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.image
  );

  return [
    {
      id: "toolbarPopup",
      type: "popover-dev",
      config: {
        icon: "nc-popup",
        title: "Popup"
      },
      devices: "desktop",
      position: 70,
      options: [
        toolbarElementSectionGlobal({
          device,
          component,
          blockType: "popup",
          devices: "desktop",
          state: "normal"
        })
      ]
    },
    {
      id: "toolbarMedia",
      type: "popover-dev",
      config: {
        icon: "nc-background",
        title: t("Background")
      },
      position: 80,
      options: [
        {
          id: "tabsMedia",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabMedia",
              label: t("Image"),
              options: [
                {
                  id: "bg",
                  type: "imageUpload-dev",
                  population: imageDynamicContentChoices
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(bgColorHex, dvv("bgColorOpacity"))
          }
        }
      },
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabOverlay",
              label: t("Overlay"),
              options: [
                {
                  id: "",
                  type: "backgroundColor-dev"
                }
              ]
            },
            {
              id: "tabClose",
              label: t("Close"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    toolbarElementSectionSaved({
      device,
      component,
      blockType: "popup",
      state: "normal",
      devices: "desktop"
    })
  ];
}
