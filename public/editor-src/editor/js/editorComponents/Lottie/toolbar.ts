import { ElementModel } from "visual/component/Elements/Types";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { Block } from "visual/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { isPopup, isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { toolbarLinkAnchor } from "visual/utils/toolbar";

export interface Value extends ElementModel {
  bgColorHex: string;
  bgColorPalette: string;
  bgColorOpacity: number;
}

// @ts-expect-error old option
export const getItems: GetItems<Value> = ({ v, device, component }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );

  const config = Config.getAll();
  const IS_STORY = isStory(config);
  const IS_GLOBAL_POPUP = isPopup(config);

  const linkDC = getDynamicContentOption({
    options: component.context.dynamicContent.config,
    type: DCTypes.link
  });

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-lottie",
        title: t("Lottie")
      },
      devices: "desktop",
      position: 70,
      options: [
        {
          id: "animationLink",
          label: t("Lottie Link"),
          type: "inputText",
          devices: "desktop",
          placeholder: "lottie link",
          disabled: dvv("animationFile") !== "",
          config: {
            size: "medium"
          },
          helper: {
            content: t(
              "This is Lottie .json URL. Get more from LottieFiles.com."
            )
          }
        },
        {
          id: "animationFile",
          label: t("Lottie File"),
          type: "fileUpload",
          config: {
            allowedExtensions: [".json"],
            componentId: ElementTypes.Lottie
          },
          devices: "desktop"
        },
        {
          id: "renderer",
          type: "select",
          label: t("Renderer"),
          choices: [
            { title: "SVG", value: "svg" },
            { title: "Canvas", value: "canvas" }
          ]
        },
        {
          id: "autoplay",
          label: t("Autoplay"),
          type: "switch"
        },
        {
          id: "direction",
          label: t("Reverse"),
          type: "switch",
          disabled: dvv("autoplay") === "off",
          config: {
            on: "-1",
            off: "1"
          }
        },
        {
          id: "loop",
          label: t("Loop"),
          type: "switch",
          disabled: dvv("autoplay") === "off"
        },
        {
          id: "speed",
          type: "slider",
          label: t("Speed"),
          devices: "desktop",
          config: {
            min: 0.1,
            max: 5,
            step: 0.1
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      position: 80,
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(bgColorHex, dvv("bgColorOpacity"))
          }
        }
      },
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "",
                  type: "backgroundColor",
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
                  type: "border",
                  devices: "desktop",
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
                  type: "boxShadow",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarLink",
      type: "popover",
      config: {
        icon: "nc-link",
        size: "medium",
        title: t("Link")
      },
      position: 90,
      devices: "desktop",
      options: [
        {
          id: "linkType",
          type: "tabs",
          config: {
            saveTab: true
          },
          tabs: [
            {
              id: "page",
              label: t("Page"),
              options: [
                {
                  id: "linkPage",
                  type: "internalLink",
                  label: t("Find Page"),
                  devices: "desktop"
                }
              ]
            },
            {
              id: "external",
              label: t("URL"),
              options: [
                {
                  id: "link",
                  type: "population",
                  label: t("Link to"),
                  config: linkDC,
                  option: {
                    id: "linkExternal",
                    type: "inputText",
                    placeholder: "http://",
                    config: {
                      size: "medium"
                    }
                  }
                },
                {
                  id: "linkExternalBlank",
                  label: t("Open In New Tab"),
                  type: "switch"
                },
                {
                  id: "linkExternalRel",
                  label: t("Make it Nofollow"),
                  type: "switch"
                }
              ]
            },
            {
              id: "anchor",
              label: t("Block"),
              options: [
                // @ts-expect-error: old
                toolbarLinkAnchor({ v, disabled: IS_GLOBAL_POPUP || IS_STORY })
              ]
            },
            {
              id: "popup",
              label: t("Popup"),
              options: [
                {
                  id: "linkPopup",
                  // need to remove Old option in #24935
                  type: "legacy-promptAddPopup",
                  disabled: inPopup || inPopup2 || IS_GLOBAL_POPUP || IS_STORY,
                  label: t("Popup"),
                  popupKey: `${component.getId()}_${dvv("linkPopup")}`,
                  value: {
                    value: dvv("linkPopup"),
                    popups: dvv("popups")
                  },
                  onChange: ({
                    value,
                    popups
                  }: {
                    value: string;
                    popups: Block[];
                  }) => ({
                    linkPopup: value,
                    popups
                  })
                }
              ]
            },
            {
              id: "story",
              label: t("Slides"),
              options: [
                {
                  id: "linkToSlide",
                  type: "number",
                  label: t("Slide"),
                  disabled: !IS_STORY,
                  config: {
                    min: 1,
                    max: 1000000
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        title: t("Settings"),
        icon: "nc-cog"
      },
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          config: {
            min: 1,
            max: dvv("widthSuffix") === "px" ? 1000 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        },
        {
          id: "grid",
          type: "grid",
          config: { separator: true },
          columns: [
            {
              id: "grid-settings",
              size: 1,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton",
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
              size: 1,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton",
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
