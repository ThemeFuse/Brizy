import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import {
  getOptionColorHexByPalette,
  getDynamicContentChoices
} from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import {
  toolbarBgVideoUrl,
  toolbarElementSectionSaved
} from "visual/utils/toolbar";
import { DCTypes } from "visual/global/Config/types/DynamicContent";

export function getItems({ v, component, device, context }) {
  const dvv = key => defaultValueValue({ v, key, device });

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
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-background",
        title: t("Background")
      },
      position: 80,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Background"),
              options: [
                {
                  id: "media",
                  label: t("Type"),
                  type: "radioGroup-dev",
                  devices: "desktop",
                  choices: [
                    { value: "image", icon: "nc-media-image" },
                    { value: "video", icon: "nc-media-video" },
                    { value: "map", icon: "nc-media-map" }
                  ]
                },
                {
                  label: t("Image"),
                  id: "bg",
                  type: "imageUpload-dev",
                  disabled: dvv("media") !== "image",
                  population: imageDynamicContentChoices
                },
                toolbarBgVideoUrl({
                  v,
                  device,
                  devices: "desktop",
                  disabled: dvv("media") !== "video",
                  state: "normal"
                }),
                {
                  id: "bgVideoLoop",
                  label: t("Loop"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: dvv("media") !== "video"
                },
                {
                  id: "bgVideoStart",
                  type: "number-dev",
                  label: t("Start"),
                  devices: "desktop",
                  disabled: dvv("media") !== "video",
                  config: {
                    size: "short",
                    spinner: false,
                    max: 99999
                  },
                  helper: {
                    content: t("Specify a start time (in seconds)")
                  }
                },
                {
                  id: "bgMapAddress",
                  label: t("Address"),
                  type: "inputText-dev",
                  placeholder: t("Enter address"),
                  devices: "desktop",
                  disabled: dvv("media") !== "map"
                },
                {
                  id: "bgMapZoom",
                  label: t("Zoom"),
                  type: "slider-dev",
                  disabled: dvv("media") !== "map",
                  config: {
                    min: 1,
                    max: 21
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
      devices: "desktop",
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
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border-dev"
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
      devices: "desktop",
      disabled: true,
      state: "normal"
    }),
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
      icon: "nc-cog"
    }
  ];
}
