import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { getColor as getGlobalColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Color, ItemValue, Network, TargetUrl, View } from "../types";
import { getColor, getTargetUrl, getView } from "../utils";

export const getItems: GetItems<ItemValue> = ({ v, device, context }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const view = getView(dvv("view"));
  const colorType = getColor(dvv("colorType"));
  const targetUrl = getTargetUrl(dvv("targetUrl"));

  const isIcon = view === View.Icon;
  const isText = view === View.Text;
  const officialColor = colorType === Color.Official;
  const currentUrl = targetUrl === TargetUrl.CurrentUrl;

  const iconBgColor = getGlobalColor(
    dvv("iconBgColorPalette"),
    dvv("iconBgColorHex"),
    dvv("iconBgColorOpacity")
  );

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText,
    config: { iconOnly: true }
  });

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-share-2",
        title: t("Button")
      },
      position: 10,
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs",
          config: {
            showSingle: true
          },
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Content"),
              options: [
                {
                  id: "network",
                  label: t("Network"),
                  type: "select",
                  position: 10,
                  devices: "desktop",
                  choices: [
                    { title: t("Facebook"), value: Network.Facebook },
                    { title: t("Twitter"), value: Network.Twitter },
                    { title: t("Linkedin"), value: Network.Linkedin },
                    { title: t("Pinterest"), value: Network.Pinterest },
                    { title: t("Reddit"), value: Network.Reddit },
                    { title: t("VK"), value: Network.VK },
                    { title: t("OK"), value: Network.OK },
                    { title: t("Tumblr"), value: Network.Tumblr },
                    { title: t("Skype"), value: Network.Skype },
                    { title: t("Telegram"), value: Network.Telegram },
                    { title: t("Pocket"), value: Network.Pocket },
                    { title: t("XING"), value: Network.XING },
                    { title: t("WhatsApp"), value: Network.WhatsApp },
                    { title: t("Email"), value: Network.Email }
                  ]
                },
                {
                  id: "customLabelText",
                  type: "inputText",
                  label: t("Custom Label"),
                  position: 20,
                  devices: "desktop",
                  config: {
                    size: "medium"
                  },
                  disabled: isIcon
                },
                {
                  id: "view",
                  label: t("View"),
                  type: "select",
                  position: 30,
                  choices: [
                    { title: t("Icon & Text"), value: View.IconText },
                    { title: t("Icon"), value: View.Icon },
                    { title: t("Text"), value: View.Text }
                  ]
                },
                {
                  id: "colorType",
                  label: t("Color"),
                  type: "select",
                  position: 40,
                  devices: "desktop",
                  choices: [
                    { title: t("Official"), value: Color.Official },
                    { title: t("Custom"), value: Color.Custom }
                  ]
                },
                {
                  id: "urlGroup",
                  type: "group",
                  position: 50,
                  options: [
                    {
                      id: "targetUrl",
                      label: t("Target URL"),
                      type: "select",
                      devices: "desktop",
                      choices: [
                        {
                          title: t("Current Page"),
                          value: TargetUrl.CurrentUrl
                        },
                        {
                          title: t("Custom Page"),
                          value: TargetUrl.CustomUrl
                        }
                      ]
                    },
                    {
                      id: "href",
                      type: "inputText",
                      label: t("URL"),
                      placeholder: "https://your-link.com",
                      disabled: currentUrl,
                      devices: "desktop"
                    }
                  ]
                }
              ]
            },
            {
              id: "currentShortcodeButtonTab",
              label: t("Button"),
              options: [
                {
                  id: "buttonWidth",
                  label: t("Width"),
                  type: "slider",
                  disabled: isIcon,
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                },
                {
                  id: "buttonHeight",
                  label: t("Height"),
                  type: "slider",
                  disabled: isIcon,
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            },
            {
              id: "currentShortcodeIconTab",
              label: t("Icon"),
              options: [
                {
                  id: "iconCustomSize",
                  label: t("Size"),
                  type: "slider",
                  disabled: isText,
                  config: {
                    min: 1,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                },
                {
                  id: "iconWidth",
                  label: t("Width"),
                  type: "slider",
                  disabled: isText,
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                },
                {
                  id: "buttonHeight",
                  label: t("Height"),
                  type: "slider",
                  disabled: isText,
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
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
      type: "popover",
      config: {
        icon: "nc-font",
        size: "auto",
        title: t("Typography")
      },
      position: 20,
      disabled: isIcon,
      options: [
        {
          id: "gridTypography",
          type: "grid",
          config: { separator: true },
          columns: [
            {
              id: "col-1",
              size: 1,
              align: "center",
              options: [
                {
                  id: "typography",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "col-2",
              size: "auto",
              align: "center",
              options: [
                {
                  id: "text",
                  type: "population",
                  config: richTextDC,
                  devices: "desktop"
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
      disabled: officialColor,
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: iconBgColor
          }
        }
      },
      devices: "desktop",
      position: 30,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBgIcon",
              label: t("Bg Icon"),
              options: [
                {
                  id: "icon",
                  type: "backgroundColor",
                  disabled: isText,
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBgText",
              label: t("Bg Text"),
              options: [
                {
                  id: "text",
                  type: "backgroundColor",
                  disabled: isIcon,
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabIcon",
              label: t("Color Icon"),
              options: [
                {
                  id: "iconColor",
                  type: "colorPicker",
                  disabled: isText,
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabText",
              label: t("Color Text"),
              options: [
                {
                  id: "textColor",
                  type: "colorPicker",
                  disabled: isIcon,
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
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      position: 110
    }
  ];
};
