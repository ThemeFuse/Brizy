import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { NORMAL } from "visual/utils/stateMode";
import {
  badgeBgColorCSS,
  badgeIconColorCSS,
  badgePositionCSS,
  barColorCSS,
  dialogBgColorCSS,
  dialogTextColorCSS,
  switchColorCSS
} from "./css";
import type { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device, component }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const config = component.getGlobalConfig();

  const currentView = dvv("currentView");
  const isBannerView = currentView === "banner";
  const isBadgeView = currentView === "badge";
  const isPreferencesView = currentView === "preferences";

  const barColorSwatch = getColorToolbar(
    dvv("barColorPalette"),
    dvv("barColorHex"),
    dvv("barColorOpacity")
  );

  const badgeBgColorSwatch = getColorToolbar(
    dvv("badgeBgColorPalette"),
    dvv("badgeBgColorHex"),
    dvv("badgeBgColorOpacity")
  );

  const dialogBgColorSwatch = getColorToolbar(
    dvv("dialogBgColorPalette"),
    dvv("dialogBgColorHex"),
    dvv("dialogBgColorOpacity")
  );

  return [
    {
      id: "toolbarCookieBanner",
      type: "popover",
      config: {
        icon: "t2-cookie-banner",
        title: t("Cookie Banner")
      },
      position: 10,
      options: [
        {
          id: "currentView",
          label: t("View"),
          type: "radioGroup",
          choices: [
            { icon: "t2-cookie-banner", title: t("Banner"), value: "banner" },
            {
              icon: "t2-cookie-banner-badge",
              title: t("Badge"),
              value: "badge"
            },
            {
              icon: "nc-cog",
              title: t("Preferences"),
              value: "preferences"
            }
          ]
        },
        {
          id: "badgePosition",
          label: t("Position"),
          type: "radioGroup",
          disabled: !isBadgeView,
          choices: [
            {
              icon: "nc-align-bottom-left",
              title: t("Bottom Left"),
              value: "bottomLeft"
            },
            {
              icon: "nc-align-bottom-right",
              title: t("Bottom Right"),
              value: "bottomRight"
            }
          ],
          style: badgePositionCSS
        }
      ]
    },
    {
      id: "toolbarColorBanner",
      type: "popover",
      disabled: !isBannerView,
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: barColorSwatch
          }
        }
      },
      position: 20,
      options: [
        {
          id: "tabsColorBanner",
          type: "tabs",
          tabs: [
            {
              id: "tabBarBg",
              label: t("Background"),
              options: [
                {
                  id: "barColor",
                  type: "colorPicker",
                  states: [NORMAL],
                  style: barColorCSS(config)
                }
              ]
            },
            {
              id: "tabBarBorder",
              label: t("Border"),
              options: [
                {
                  id: "barBorder",
                  type: "border",
                  selector: "{{WRAPPER}} .brz-cookie-banner__bar"
                }
              ]
            },
            {
              id: "tabBarShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "barBoxShadow",
                  type: "boxShadow",
                  selector: "{{WRAPPER}} .brz-cookie-banner__bar"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColorBadge",
      type: "popover",
      disabled: !isBadgeView,
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: badgeBgColorSwatch
          }
        }
      },
      position: 20,
      options: [
        {
          id: "tabsColorBadge",
          type: "tabs",
          tabs: [
            {
              id: "tabBadgeBg",
              label: t("Background"),
              options: [
                {
                  id: "badgeBgColor",
                  type: "colorPicker",
                  states: [NORMAL],
                  style: badgeBgColorCSS(config)
                }
              ]
            },
            {
              id: "tabBadgeIcon",
              label: t("Icon"),
              options: [
                {
                  id: "badgeIconColor",
                  type: "colorPicker",
                  states: [NORMAL],
                  style: badgeIconColorCSS(config)
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColorPreferences",
      type: "popover",
      disabled: !isPreferencesView,
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: dialogBgColorSwatch
          }
        }
      },
      position: 20,
      options: [
        {
          id: "tabsColorPreferences",
          type: "tabs",
          tabs: [
            {
              id: "tabDialogBg",
              label: t("Bg"),
              options: [
                {
                  id: "dialogBgColor",
                  type: "colorPicker",
                  states: [NORMAL],
                  style: dialogBgColorCSS(config)
                }
              ]
            },
            {
              id: "tabDialogText",
              label: t("Text"),
              options: [
                {
                  id: "dialogTextColor",
                  type: "colorPicker",
                  states: [NORMAL],
                  style: dialogTextColorCSS(config)
                }
              ]
            },
            {
              id: "tabDialogSwitch",
              label: t("Switch"),
              options: [
                {
                  id: "switchColor",
                  type: "colorPicker",
                  states: [NORMAL],
                  style: switchColorCSS(config)
                }
              ]
            },
            {
              id: "tabDialogBorder",
              label: t("Border"),
              options: [
                {
                  id: "dialogBorder",
                  type: "border",
                  selector: "{{WRAPPER}} .brz-cookie-banner__dialog"
                }
              ]
            },
            {
              id: "tabDialogShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "dialogBoxShadow",
                  type: "boxShadow",
                  selector: "{{WRAPPER}} .brz-cookie-banner__dialog"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
