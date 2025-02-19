import { ElementModel } from "visual/component/Elements/Types";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export interface Value extends ElementModel {
  bgColorHex: string;
  bgColorPalette: string;
  borderColorHex: string;
  borderColorPalette: string;
}

export const getItems: GetItems<Value> = ({ v, device, context }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const bgColorOpacity = dvv("bgColorOpacity");

  const bgColor = getColorToolbar(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    bgColorOpacity
  );
  const borderColor = getColorToolbar(
    dvv("borderColorPalette"),
    dvv("borderColorHex"),
    dvv("borderColorOpacity")
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
      type: "popover",
      devices: "desktop",
      config: {
        icon: "nc-audio",
        title: t("Audio")
      },
      position: 80,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElementUpload",
              label: t("Audio"),
              options: [
                {
                  id: "url",
                  label: t("Link"),
                  type: "inputText",
                  disabled: customType,
                  placeholder: t("SoundCloud Link"),
                  population: linkDC
                },
                {
                  id: "style",
                  label: t("Style"),
                  disabled: customType,
                  type: "radioGroup",
                  choices: [
                    {
                      value: "basic",
                      icon: "nc-sndcloud-style-1"
                    },
                    {
                      value: "artwork",
                      icon: "nc-sndcloud-style-2"
                    }
                  ]
                },
                {
                  id: "autoPlay",
                  label: t("Autoplay"),
                  type: "switch",
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
                  type: "switch",
                  disabled: customType
                },
                {
                  id: "comments",
                  label: t("Comments"),
                  type: "switch",
                  disabled: customType
                },
                {
                  id: "playCounts",
                  label: t("Play Counts"),
                  type: "switch",
                  disabled: customType
                },
                {
                  id: "username",
                  label: t("Username"),
                  type: "switch",
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
                  type: "switch",
                  disabled: customType
                },
                {
                  id: "buyButton",
                  label: t("Buy"),
                  type: "switch",
                  disabled: customType
                },
                {
                  id: "downloadButton",
                  label: t("Download"),
                  type: "switch",
                  disabled: customType
                },
                {
                  id: "shareButton",
                  label: t("Share"),
                  type: "switch",
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
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: bgColorOpacity > 0 ? borderColor : bgColor
          }
        }
      },
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabIcon",
              label: t("Icon"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
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
                  type: "colorPicker",
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
                  type: "colorPicker",
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
            },
            {
              id: "tabControls",
              label: t("Controls"),
              options: [
                {
                  id: "controls",
                  type: "colorPicker",
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
      type: "popover",
      config: { icon: "nc-cog", title: t("Settings") },
      roles: ["admin"],
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
              { value: "%", title: "%" },
              { value: "px", title: "px" }
            ]
          }
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider",
          config: {
            min: 40,
            max: 300,
            units: [{ value: "px", title: "px" }]
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
