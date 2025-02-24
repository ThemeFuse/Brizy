import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isBackgroundPointerEnabled } from "visual/global/Config/types/configs/featuresValue";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { ImageType } from "visual/utils/image/types";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { getInstanceParentId } from "visual/utils/toolbar";

export function getItems({ v, device, component, context }) {
  const config = component.getGlobalConfig();
  const dvv = (key) => defaultValueValue({ v, key, device, state: "normal" });

  const bgColor = getColorToolbar(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    dvv("bgColorOpacity")
  );
  const imageDynamicContentChoices = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.image
  });

  const isExternalImage = dvv("bgImageType") !== ImageType.Internal;
  const isPointerEnabled = isBackgroundPointerEnabled(config, "sectionPopup");
  const showGlobal = typeof config.api?.globalBlocks?.create === "function";
  const showSavedBlock = typeof config.api?.savedBlocks?.create === "function";

  return [
    {
      id: "toolbarPopup",
      type: "popover",
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
          type: "globalBlock",
          devices: "desktop",
          disabled: !showGlobal,
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
      type: "popover",
      config: {
        icon: "nc-background",
        title: t("Background")
      },
      position: 80,
      options: [
        {
          id: "tabsMedia",
          type: "tabs",
          tabs: [
            {
              id: "tabMedia",
              label: t("Image"),
              options: [
                {
                  id: "bg",
                  type: "imageUpload",
                  population: imageDynamicContentChoices,
                  config: {
                    disableSizes: isExternalImage,
                    pointer: !isExternalImage && isPointerEnabled
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: bgColor
          }
        }
      },
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabOverlay",
              label: t("Overlay"),
              options: [
                {
                  id: "",
                  type: "backgroundColor"
                }
              ]
            },
            {
              id: "tabClose",
              label: t("Close"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
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
      type: "savedBlock",
      devices: "desktop",
      disabled: !showSavedBlock,
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
