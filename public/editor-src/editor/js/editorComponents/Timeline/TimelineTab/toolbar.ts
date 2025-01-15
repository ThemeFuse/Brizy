import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { Value } from "./index";

export const getItems = ({
  v,
  device
}: {
  v: Value;
  device: ResponsiveMode;
}): ToolbarItemType[] => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  // Color
  const bgColorOpacity = dvv("bgColorOpacity");
  const bgColor = getColor(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    bgColorOpacity
  );
  const color = getColor(
    dvv("colorPalette"),
    dvv("colorHex"),
    dvv("colorOpacity")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: { icon: "nc-timeline", title: t("Timeline") },
      position: 70,
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Icon"),
              position: 60,
              options: [
                {
                  id: "",
                  label: t("Icon"),
                  type: "iconSetter",
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
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: bgColorOpacity ? bgColor : color
          }
        }
      },
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "color",
          type: "tabs",
          tabs: [
            {
              id: "bg",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker"
                }
              ]
            },
            {
              id: "icon",
              label: t("Icon"),
              options: [
                {
                  id: "color",
                  type: "colorPicker"
                }
              ]
            },
            {
              id: "border",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border"
                }
              ]
            },
            {
              id: "shadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
