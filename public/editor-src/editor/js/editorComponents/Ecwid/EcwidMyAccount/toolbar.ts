import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { Value } from "./index";

export function getItems({
  v,
  device
}: {
  v: Value;
  device: ResponsiveMode;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        title: t("Cart"),
        icon: "nc-woo-add-to-cart"
      },
      position: 10,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "general",
              label: t("General"),
              options: [
                {
                  id: "footerDisplay",
                  label: t("Footer"),
                  type: "switch-dev"
                },
                {
                  id: "signInDisplay",
                  label: t("Sign-in link"),
                  type: "switch-dev",
                  disabled: dvv("footerDisplay") === "off"
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
      disabled: true,
      choices: []
    },
    {
      id: "advancedSettings",
      // @ts-expect-error old option
      type: "advancedSettings",
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}
