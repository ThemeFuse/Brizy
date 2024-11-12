import { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { isPopup, isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { popupToOldModel } from "visual/utils/options/PromptAddPopup/utils";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { toolbarLinkAnchor } from "visual/utils/toolbar";
import { Value } from "./type";
import {
  RendererType,
  TriggerType
} from "@brizy/component/src/Flex/Lottie/types";
import { isLottieFile } from "./utils";

export const getItems: GetItems<Value> = ({ v, device, component }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);
  const isRendererDisabled =
    isLottieFile(dvv("animationLink")) || isLottieFile(dvv("animationFile"));

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

  const isScrollTrigger = dvv("trigger") === TriggerType.OnScroll;
  const isHoverTrigger = dvv("trigger") === TriggerType.OnHover;
  const isLoadTrigger = dvv("trigger") === TriggerType.OnLoad;

  const _isAutoplay = dvv("autoplay") === "off";

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
          placeholder: "lottie link",
          disabled: dvv("animationFile") !== "",
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
            allowedExtensions: [".json", ".lottie"],
            componentId: ElementTypes.Lottie
          }
        },
        {
          id: "trigger",
          type: "select",
          disabled: IS_STORY,
          label: t("Trigger On"),
          choices: [
            { title: t("Load"), value: TriggerType.OnLoad },
            { title: t("Hover"), value: TriggerType.OnHover },
            { title: t("Click"), value: TriggerType.OnClick },
            { title: t("Scroll"), value: TriggerType.OnScroll }
          ]
        },
        {
          id: "renderer",
          type: "select",
          label: t("Renderer"),
          choices: [
            { title: t("SVG"), value: RendererType.SVG },
            { title: t("Canvas"), value: RendererType.Canvas }
          ],
          disabled: isRendererDisabled
        },
        {
          id: "lazyload",
          label: t("Lazy Load"),
          type: "switch"
        },
        {
          id: "autoplay",
          label: t("Autoplay"),
          type: "switch",
          disabled: !isLoadTrigger
        },
        {
          id: "direction",
          label: t("Reverse"),
          type: "switch",
          disabled: _isAutoplay || isHoverTrigger || isScrollTrigger,
          config: {
            on: "-1",
            off: "1"
          }
        },
        {
          id: "loop",
          label: t("Loop"),
          type: "switch",
          disabled: _isAutoplay || isScrollTrigger
        },
        {
          id: "speed",
          type: "slider",
          label: t("Speed"),
          disabled: isScrollTrigger,
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
                  label: t("Find Page")
                },
                {
                  id: "linkInternalBlank",
                  label: t("Open In New Tab"),
                  type: "switch"
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
                    placeholder: "http://"
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
                  type: "promptAddPopup",
                  disabled: inPopup || inPopup2 || IS_GLOBAL_POPUP || IS_STORY,
                  label: t("Popup"),
                  config: {
                    popupKey: `${component.getId()}_${dvv("linkPopup")}`
                  },
                  dependencies: popupToOldModel
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
