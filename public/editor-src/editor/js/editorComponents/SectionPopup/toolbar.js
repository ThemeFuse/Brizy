import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { getInstanceParentId } from "visual/utils/toolbar";

export function getItems({ v, device, component, context }) {
  const config = Config.getAll();
  const dvv = (key) => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const imageDynamicContentChoices = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.image
  });

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
        {
          id: "makeItGlobal",
          label: t("Make it Global"),
          type: "globalBlock-dev",
          devices: "desktop",
          disabled: isCloud(config) && isShopify(config),
          config: {
            _id: component.getId(),
            parentId: getInstanceParentId(component.props.instanceKey, "popup"),
            blockType: "popup"
          }
        }
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
    {
      id: "makeItSaved",
      type: "savedBlock-dev",
      devices: "desktop",
      position: 90,
      config: {
        icon: "nc-save-section",
        blockType: "popup",
        title: t("Save"),
        tooltipContent: t("Saved"),
        blockId: component.getId()
      }
    }
  ];
}
