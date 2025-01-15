import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { Value } from "./types/Value";

export function getItems({
  v,
  device
}: {
  v: Value;
  device: ResponsiveMode;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const parentBgColor = getColor(
    dvv("parentBgColorPalette"),
    dvv("parentBgColorHex"),
    dvv("parentBgColorOpacity")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      config: { title: t("Cart"), icon: "nc-woo-add-to-cart" },
      position: 10,
      options: [
        {
          id: "collapseDesktop",
          label: t("Collapse"),
          type: "switch",
          devices: "desktop",
          helper: {
            content:
              "Cart items list is shown in collapsed view on desktop when more than 4 products added."
          }
        },
        {
          id: "qtyDisplay",
          label: t("Show QTY"),
          type: "switch",
          devices: "desktop",
          disabled: dvv("collapseDesktop") === "on"
        },
        {
          id: "skuDisplay",
          label: t("SKU"),
          type: "switch",
          devices: "desktop",
          disabled: dvv("collapseDesktop") === "on"
        },
        {
          id: "weightDisplay",
          label: t("Weight"),
          type: "switch",
          devices: "desktop",
          disabled: dvv("collapseDesktop") === "on"
        },
        {
          id: "inputDisplay",
          label: t("Input"),
          devices: "desktop",
          type: "switch"
        },
        {
          id: "addressDisplay",
          devices: "desktop",
          label: t("Address line"),
          type: "switch"
        },
        {
          id: "footerDisplay",
          label: t("Footer"),
          devices: "desktop",
          type: "switch"
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
            backgroundColor: parentBgColor
          }
        }
      },
      position: 20,
      options: [
        {
          id: "parent",
          type: "backgroundColor"
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true,
      choices: []
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      disabled: true
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: { title: t("Settings") },
      position: 110,
      devices: "desktop",
      options: [
        {
          id: "cartWidth",
          label: t("Width"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "grid",
          type: "grid",
          config: { separator: true },
          columns: [
            {
              id: "col-1",
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
              id: "col-2",
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
}
