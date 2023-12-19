import { ElementModel } from "visual/component/Elements/Types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { toolbarElementSoundCloudStyle } from "visual/utils/toolbar";
import { EditorComponentContextValue } from "../EditorComponent/EditorComponentContext";
import { ToolbarItemType } from "../ToolbarItemType";

export interface Value extends ElementModel {
  bgColorHex: string;
  bgColorPalette: string;
  borderColorHex: string;
  borderColorPalette: string;
}

export function getItems({
  v,
  device,
  context
}: {
  v: Value;
  device: ResponsiveMode;
  context: EditorComponentContextValue;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
  );
  const linkDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.link
  });

  const type = dvv("type");
  const customType = type === "custom";

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      devices: "desktop",
      config: {
        icon: "nc-audio",
        title: t("Audio")
      },
      position: 80,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabCurrentElementUpload",
              label: t("Audio"),
              options: [
                {
                  id: "url",
                  label: t("Link"),
                  type: "inputText-dev",
                  disabled: customType,
                  placeholder: t("SoundCloud Link"),
                  population: linkDC,
                  config: {
                    size: "medium"
                  }
                },
                // @ts-expect-error old option
                toolbarElementSoundCloudStyle({
                  v,
                  device,
                  disabled: customType,
                  state: "normal"
                }),
                {
                  id: "autoPlay",
                  label: t("Autoplay"),
                  type: "switch-dev",
                  disabled: customType
                }
              ]
            },
            {
              id: "soundCloudAppearenceOptions",
              label: t("Appearance"),
              options: [
                {
                  id: "artWork",
                  label: t("Artwork"),
                  type: "switch-dev",
                  disabled: customType
                },
                {
                  id: "comments",
                  label: t("Comments"),
                  type: "switch-dev",
                  disabled: customType
                },
                {
                  id: "playCounts",
                  label: t("Play Counts"),
                  type: "switch-dev",
                  disabled: customType
                },
                {
                  id: "username",
                  label: t("Username"),
                  type: "switch-dev",
                  disabled: customType
                }
              ]
            },
            {
              id: "soundCloudButtonsOptions",
              label: t("Buttons"),
              options: [
                {
                  id: "likeButton",
                  label: t("Like"),
                  type: "switch-dev",
                  disabled: customType
                },
                {
                  id: "buyButton",
                  label: t("Buy"),
                  type: "switch-dev",
                  disabled: customType
                },
                {
                  id: "downloadButton",
                  label: t("Download"),
                  type: "switch-dev",
                  disabled: customType
                },
                {
                  id: "shareButton",
                  label: t("Share"),
                  type: "switch-dev",
                  disabled: customType
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
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor:
              dvv("bgColorOpacity") > 0
                ? hexToRgba(borderColorHex, dvv("borderColorOpacity"))
                : hexToRgba(bgColorHex, dvv("bgColorOpacity"))
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
              id: "tabIcon",
              label: t("Icon"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  disabled: dvv("type") === "soundcloud",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBgProgress",
              label: t("Slider"),
              options: [
                {
                  id: "bg2Color",
                  type: "colorPicker-dev",
                  disabled: dvv("type") === "soundcloud",
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
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabControls",
              label: t("Controls"),
              options: [
                {
                  id: "controls",
                  type: "colorPicker-dev",
                  disabled: customType,
                  config: {
                    opacity: false
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
      type: "popover-dev",
      config: { icon: "nc-cog", title: t("Settings") },
      roles: ["admin"],
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
              { value: "%", title: "%" },
              { value: "px", title: "px" }
            ]
          }
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider-dev",
          config: {
            min: 40,
            max: 300,
            units: [{ value: "px", title: "px" }]
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
