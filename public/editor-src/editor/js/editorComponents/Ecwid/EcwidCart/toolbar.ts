import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
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

  const { hex: parentBgColorHex } = getOptionColorHexByPalette(
    dvv("parentBgColorHex"),
    dvv("parentBgColorPalette")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: { title: t("Cart"), icon: "nc-woo-add-to-cart" },
      position: 10,
      options: [
        {
          id: "collapseDesktop",
          label: t("Collapse"),
          type: "switch-dev",
          devices: "desktop",
          helper: {
            content:
              "Cart items list is shown in collapsed view on desktop when more than 4 products added."
          }
        },
        {
          id: "collapse",
          label: t("Collapse"),
          type: "switch-dev",
          devices: "responsive",
          helper: {
            content: "Cart items list is shown in collapsed view on mobile."
          }
        },
        {
          id: "breadcrumbsDisplay",
          label: t("Breadcrumbs"),
          devices: "desktop",
          type: "switch-dev"
        },
        {
          id: "qtyDisplay",
          label: t("Show QTY"),
          type: "switch-dev",
          devices: "desktop",
          disabled: dvv("collapse") === "on"
        },
        {
          id: "skuDisplay",
          label: t("SKU"),
          type: "switch-dev",
          devices: "desktop",
          disabled: dvv("collapse") === "on"
        },
        {
          id: "weightDisplay",
          label: t("Weight"),
          type: "switch-dev",
          devices: "desktop",
          disabled: dvv("collapse") === "on"
        },
        {
          id: "inputDisplay",
          label: t("Input"),
          devices: "desktop",
          type: "switch-dev"
        },
        {
          id: "addressDisplay",
          devices: "desktop",
          label: t("Address line"),
          type: "switch-dev"
        },
        {
          id: "footerDisplay",
          label: t("Footer"),
          devices: "desktop",
          type: "switch-dev"
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      devices: "desktop",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              parentBgColorHex,
              dvv("parentBgColorOpacity")
            )
          }
        }
      },
      position: 20,
      options: [
        {
          id: "parent",
          type: "backgroundColor-dev"
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true,
      choices: []
    },
    {
      id: "advancedSettings",
      // @ts-expect-error old option
      type: "advancedSettings",
      disabled: true
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: { title: t("Settings") },
      position: 110,
      devices: "desktop",
      options: [
        {
          id: "cartWidth",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "grid",
          type: "grid-dev",
          config: { separator: true },
          columns: [
            {
              id: "col-1",
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
              id: "col-2",
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
