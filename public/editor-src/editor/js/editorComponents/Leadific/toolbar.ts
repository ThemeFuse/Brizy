import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { Block } from "visual/types";
import { getLeadificCustomFields } from "visual/utils/api";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { isPopup, isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import * as Str from "visual/utils/string/specs";
import { toolbarLinkAnchor } from "visual/utils/toolbar";
import { GetItems } from "../EditorComponent/types";
import { Props, Value } from "./types";

//@ts-expect-error Old options
export const getItems: GetItems<Value, Props> = ({
  v,
  device,
  context,
  component,
  state
}) => {
  const config = Config.getAll();

  const IS_STORY = isStory(config);
  const IS_GLOBAL_POPUP = isPopup(config);

  const inPopup = Boolean(component.props.meta?.sectionPopup);
  const inPopup2 = Boolean(component.props.meta?.sectionPopup2);

  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );
  const linkPopup = Str.read(dvv("linkPopup"));

  const _popups = dvv("popups");
  const popups = Array.isArray(_popups) ? _popups : [];

  const linkDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.link
  });

  return [
    {
      id: "toolbarLeadific",
      type: "popover-dev",
      config: {
        icon: "nc-leadific",
        title: t("Leadific")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabSettings",
              label: t("Settings"),
              options: [
                {
                  id: "leadificCustomFields",
                  devices: "desktop",
                  label: t("Custom Fields"),
                  type: "select-dev",
                  choices: {
                    load: () => getLeadificCustomFields(config),
                    emptyLoad: {
                      title: t("No custom fields found!")
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "typography",
          type: "typography-dev",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(colorHex, dvv("colorOpacity"))
          }
        }
      },
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabTextStroke",
              label: t("Stroke"),
              options: [
                {
                  id: "textStrokeBorder",
                  type: "border-dev",
                  config: {
                    width: ["grouped"],
                    styles: ["none", "solid"]
                  },
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabTextShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "textShadow",
                  type: "textShadow-dev",
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
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "linkType",
          type: "tabs-dev",
          config: {
            saveTab: true
          },
          tabs: [
            {
              id: "external",
              label: t("URL"),
              options: [
                {
                  id: "linkExternal",
                  type: "inputText-dev",
                  label: t("Link to"),
                  placeholder: "https://",
                  devices: "desktop",
                  population: linkDC,
                  config: {
                    size: "medium"
                  }
                },
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
                toolbarLinkAnchor({
                  v,
                  device,
                  state,
                  disabled: IS_GLOBAL_POPUP || IS_STORY
                })
              ]
            },
            {
              id: "popup",
              label: t("Popup"),
              options: [
                {
                  id: "linkPopup",
                  disabled: inPopup || inPopup2 || IS_GLOBAL_POPUP || IS_STORY,
                  type: "promptAddPopup",
                  label: t("Popup"),
                  popupKey: `${component.getId()}_${linkPopup}`,
                  value: {
                    value: linkPopup,
                    popups
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
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      position: 100,
      choices: [
        {
          icon: "nc-text-align-left",
          title: t("Align"),
          value: "left"
        },
        {
          icon: "nc-text-align-center",
          title: t("Align"),
          value: "center"
        },
        {
          icon: "nc-text-align-right",
          title: t("Align"),
          value: "right"
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      devices: "desktop",
      icon: "nc-cog"
    }
  ];
};
