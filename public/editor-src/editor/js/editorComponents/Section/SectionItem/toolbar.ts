import type { ElementModel } from "visual/component/Elements/Types";
import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentChoices,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import {
  toolbarBgVideoUrl,
  toolbarElementContainerTypeImageMap
} from "visual/utils/toolbar";

// @ts-expect-error old options
export const getItems: GetItems<ElementModel> = ({
  v,
  device,
  component,
  state,
  context
}) => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const imageDynamicContentChoices = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.image
  );

  // @ts-expect-error need to add type isSlider
  const { isSlider: inSlider } = component.props.meta.section;

  const media = dvv("media");

  const imageMedia = media === "image";
  const videoMedia = media !== "video";
  const mapMedia = media !== "map";

  const coverBg = dvv("bgSize") === "cover";

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
                // @ts-expect-error need to change to new option
                toolbarElementContainerTypeImageMap({
                  v,
                  device,
                  devices: "responsive",
                  state: "normal"
                }),
                {
                  label: t("Image"),
                  id: "bg",
                  type: "imageUpload-dev",
                  states:
                    // https://github.com/bagrinsergiu/blox-editor/issues/9032
                    imageMedia ? [NORMAL, HOVER] : undefined,
                  disabled: !imageMedia,
                  population: imageDynamicContentChoices
                },
                {
                  id: "bgSize",
                  label: t("Size"),
                  type: "select-dev",
                  disabled: !imageMedia,
                  choices: [
                    { title: t("Cover"), value: "cover" },
                    { title: t("Contain"), value: "contain" },
                    { title: t("Auto"), value: "auto" }
                  ]
                },
                {
                  id: "bgRepeat",
                  label: t("Repeat"),
                  type: "switch-dev",
                  disabled: !imageMedia || coverBg
                },
                {
                  id: "bgAttachment",
                  label: t("Parallax"),
                  type: "select-dev",
                  devices: "desktop",
                  disabled: !imageMedia || !coverBg || inSlider,
                  choices: [
                    { title: t("None"), value: "none" },
                    { title: t("Fixed"), value: "fixed" },
                    { title: t("Animated"), value: "animated" }
                  ]
                },
                // @ts-expect-error need to change to new option
                toolbarBgVideoUrl({
                  v,
                  device,
                  devices: "desktop",
                  disabled: videoMedia,
                  state: "normal"
                }),
                {
                  id: "bgVideoLoop",
                  label: t("Loop"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: videoMedia
                },
                {
                  id: "bgVideoStart",
                  type: "number-dev",
                  label: t("Start"),
                  devices: "desktop",
                  disabled: videoMedia,
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
                  disabled: mapMedia
                },
                {
                  id: "bgMapZoom",
                  label: t("Zoom"),
                  type: "slider-dev",
                  disabled: mapMedia,
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
                  type: "backgroundColor-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
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
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "containerTypeGroup",
          type: "group-dev",
          position: 10,
          devices: "desktop",
          options: [
            {
              id: "containerType",
              label: t("Width"),
              type: "select-dev",
              choices: [
                { title: t("Boxed"), value: "boxed" },
                { title: t("Full"), value: "fullWidth" }
              ]
            },
            {
              id: "containerSize",
              type: "slider-dev",
              disabled: dvv("containerType") !== "boxed",
              config: {
                min: 35,
                max: 100,
                units: [{ title: "%", value: "%" }]
              }
            }
          ]
        },
        {
          id: "containerSize",
          type: "slider-dev",
          label: t("Width"),
          position: 10,
          devices: "responsive",
          config: {
            min: 35,
            max: 100,
            units: [{ title: "%", value: "%" }]
          }
        },
        {
          id: "grid",
          type: "grid",
          separator: true,
          columns: [
            {
              id: "grid-settings",
              width: 50,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "grid-effects",
              width: 50,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
