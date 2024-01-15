import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import { Value } from "./types";

// @ts-expect-error "advancedSettings" old options
export const getItems: GetItems<Value> = ({ v, device }) => {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const isDesktop = device === "desktop";
  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-wp-breadcrumbs",
        title: t("Product Breadcrumbs")
      },
      position: 60,
      options: [
        {
          id: "textSpacing",
          label: t("Spacing"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: isDesktop ? "large" : "auto",
        title: t("Typography")
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "",
          type: "typography",
          config: {
            fontFamily: isDesktop
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      devices: "desktop",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(colorHex, dvv("colorOpacity"))
          }
        }
      },
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabLinks",
              label: t("Links"),
              devices: "desktop",
              options: [
                {
                  id: "color",
                  type: "colorPicker",
                  states: [NORMAL, HOVER, ACTIVE],
                  devices: "desktop"
                }
              ]
            },
            {
              id: "colorArrows",
              label: t("Arrows"),
              devices: "desktop",
              options: [
                {
                  id: "arrowsColor",
                  type: "colorPicker",
                  devices: "desktop"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "legacy-advancedSettings",
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      devices: "desktop"
    }
  ];
};
