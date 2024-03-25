import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { DeviceMode } from "visual/types";
import { hexToRgba } from "visual/utils/color";
import { OutputOptionStyle } from "visual/utils/cssStyle/types";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { EditorComponentContextValue } from "../EditorComponent/EditorComponentContext";
import { ToolbarItemType } from "../ToolbarItemType";
import { Value } from "./index";

export function getItems({
  v,
  device,
  context
}: {
  v: Value;
  device: DeviceMode;
  context: EditorComponentContextValue;
}): ToolbarItemType[] {
  const { hoverName } = v;
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state: "normal" });

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
  );

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

  const IS_STORY = isStory(Config.getAll());

  const hoverSelector =
    hoverName === "none" ? ".brz-map_styles" : ` .brz-ui-ed-map-content`;

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      config: {
        icon: "nc-pin",
        title: t("Map")
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Map"),
              options: [
                {
                  id: "address",
                  label: t("Address"),
                  type: "inputText",
                  placeholder: t("Enter address"),
                  population: richTextDC
                },
                {
                  id: "zoom",
                  label: t("Zoom"),
                  type: "slider",
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
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              borderColorHex,
              dvv("borderColorOpacity")
            )
          }
        }
      },
      position: 90,
      devices: "desktop",
      disabled: dvv("coverImageSrc") === "",
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
                  selector: "{{WRAPPER}}:hover .brz-ui-ed-iframe",
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
                  selector: `{{WRAPPER}}:hover${hoverSelector}:before`,
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
                  selector: "{{WRAPPER}}:hover .brz-ui-ed-map-content",
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
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      disabled: IS_STORY,
      options: [
        {
          id: "size",
          label: t("Width"),
          type: "slider",
          position: 80,
          config: {
            min: 1,
            max: dvv("sizeSuffix") === "px" ? 1000 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          },
          style: ({ value }) => {
            return {
              "{{WRAPPER}}.brz-map": {
                width: `${value.value}${value.unit || "%"}`
              }
            };
          }
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider",
          config: {
            min: 5,
            max: dvv("heightSuffix") === "%" ? 100 : 500,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          },
          style: ({ value }) => {
            const percentOutput: OutputOptionStyle = {
              "{{WRAPPER}}:after": {
                content: "",
                display: "block",
                width: 0,
                "padding-top": `${value.value}${value.unit}`
              },

              "{{WRAPPER}}.brz-map": {
                height: "unset"
              }
            };

            if (value.unit === "%") {
              return percentOutput;
            }

            return {
              "{{WRAPPER}}.brz-map": {
                height: `${value.value}${value.unit}`
              }
            };
          }
        },
        {
          id: "grid",
          type: "grid",
          config: {
            separator: true
          },
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
    },
    {
      id: "advancedSettings",
      // @ts-expect-error: Missing in new option-types
      type: "legacy-advancedSettings",
      devices: "desktop",
      icon: "nc-cog",
      position: 110,
      disabled: !IS_STORY
    }
  ];
}
