import { ElementModel } from "visual/component/Elements/Types";
import Config from "visual/global/Config";
import { Block } from "visual/types";
import { getCollectionTypes } from "visual/utils/api";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { isPopup, isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL, State } from "visual/utils/stateMode";
import {
  toolbarLinkAnchor,
  toolbarLinkExternal,
  toolbarStoryAnchor
} from "visual/utils/toolbar";
import EditorComponent from "../EditorComponent";
import { ToolbarItemType } from "../ToolbarItemType";

export interface Value extends ElementModel {
  bgColorHex: string;
  bgColorPalette: string;
  bgColorOpacity: number;
}

export function getItems({
  v,
  device,
  component
}: {
  v: Value;
  device: ResponsiveMode;
  state: State;
  component: EditorComponent<Value>;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );

  const config = Config.getAll();
  const collectionTypesHandler =
    config?.api?.collectionTypes?.loadCollectionTypes.handler;
  const IS_STORY = isStory(config);
  const IS_GLOBAL_POPUP = isPopup(config);

  const linkSource = dvv("linkSource");

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
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
          type: "inputText-dev",
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
          type: "fileUpload-dev",
          config: {
            allowedExtensions: [".json"]
          },
          devices: "desktop"
        },
        {
          id: "renderer",
          type: "select-dev",
          label: t("Renderer"),
          choices: [
            { title: "SVG", value: "svg" },
            { title: "Canvas", value: "canvas" }
          ]
        },
        {
          id: "autoplay",
          label: t("Autoplay"),
          type: "switch-dev"
        },
        {
          id: "direction",
          label: t("Reverse"),
          type: "switch-dev",
          disabled: dvv("autoplay") === "off",
          config: {
            on: "-1",
            off: "1"
          }
        },
        {
          id: "loop",
          label: t("Loop"),
          type: "switch-dev",
          disabled: dvv("autoplay") === "off"
        },
        {
          id: "speed",
          type: "slider-dev",
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
      type: "popover-dev",
      position: 80,
      config: {
        size: "auto",
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
          type: "tabs-dev",
          tabs: [
            {
              id: "tabBackground",
              label: t("Background"),
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
                  type: "boxShadow-dev",
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
      type: "popover-dev",
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
          type: "tabs-dev",
          config: {
            saveTab: true
          },
          tabs: [
            {
              id: "page",
              label: t("Page"),
              options: [
                {
                  id: "linkSource",
                  type: "select-dev",
                  disabled: !collectionTypesHandler,
                  label: t("Type"),
                  devices: "desktop",
                  choices: {
                    load: () => getCollectionTypes(config),
                    emptyLoad: {
                      title: t("There are no choices")
                    }
                  },
                  config: {
                    size: "large"
                  }
                },
                {
                  id: "linkPage",
                  type: "internalLink-dev",
                  label: t("Find Page"),
                  devices: "desktop",
                  disabled: !linkSource,
                  config: {
                    postType: linkSource
                  }
                }
              ]
            },
            {
              id: "external",
              label: t("URL"),
              options: [
                // @ts-expect-error: Old option
                toolbarLinkExternal({
                  v,
                  config: component.context.dynamicContent.config
                }),
                {
                  id: "linkExternalBlank",
                  label: t("Open In New Tab"),
                  type: "switch-dev"
                },
                {
                  id: "linkExternalRel",
                  label: t("Make it Nofollow"),
                  type: "switch-dev"
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
                  // @ts-expect-error: Old option
                  type: "promptAddPopup",
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
              // @ts-expect-error: Old option
              options: [toolbarStoryAnchor({ disabled: !IS_STORY })]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        title: t("Settings"),
        icon: "nc-cog"
      },
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
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
          type: "grid-dev",
          config: { separator: true },
          columns: [
            {
              id: "grid-settings",
              size: 1,
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
              size: 1,
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
}
