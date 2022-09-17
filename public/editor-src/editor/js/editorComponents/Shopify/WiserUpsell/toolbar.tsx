import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./index";

export const getItems = ({ v }: { v: Value }): ToolbarItemType[] => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device: "desktop", state: "normal" });

  const upsellType = dvv("upsellType");

  return [
    {
      id: "toolbarWiserUpsell",
      type: "popover-dev",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Upsells")
      },
      options: [
        {
          id: "upsellType",
          label: t("Upsell Type"),
          type: "select-dev",
          choices: [
            { title: "Related Products", value: "related" },
            { title: "Recommended Products", value: "recommended" },
            { title: "Recently View Products", value: "recentlyViewed" },
            { title: "Trending Products", value: "trending" },
            { title: "Also Bought", value: "alsoBought" },
            { title: "Top Selling Products", value: "topSelling" },
            { title: "New Arrivals", value: "newArrivals" },
            { title: "Featured Products", value: "featuredProducts" }
          ],
          helper: {
            content:
              upsellType !== ""
                ? t("Insert only one of each type of upsell on your page!")
                : ""
          }
        }
      ]
    },
    {
      id: "advancedSettings",
      // @ts-expect-error: Old option
      type: "advancedSettings",
      devices: "desktop",
      sidebarLabel: t("More Settings"),
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
};
