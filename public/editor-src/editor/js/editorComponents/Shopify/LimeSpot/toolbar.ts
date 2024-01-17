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
      id: "toolbarLimeSpot",
      type: "popover",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Upsells")
      },
      options: [
        {
          id: "upsellType",
          label: t("Upsell"),
          type: "select",
          placeholder: t("Select"),
          choices: [
            { title: "Most Popular", value: "popular" },
            { title: "You May Like", value: "youMayLike" },
            { title: "Recently Viewed", value: "recentViews" },
            { title: "Trending", value: "trending" },
            { title: "Cross-Sell", value: "crossSell" },
            { title: "Bought Together", value: "boughtTogether" },
            { title: "Related Items", value: "related" },
            { title: "New Arrivals", value: "newArrival" },
            {
              title: "Featured Collection 1",
              value: "featuredCollection1"
            },
            {
              title: "Featured Collection 2",
              value: "featuredCollection2"
            },
            {
              title: "Featured Collection 3",
              value: "featuredCollection3"
            },
            {
              title: "Featured Collection 4",
              value: "featuredCollection4"
            }
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
      type: "legacy-advancedSettings",
      devices: "desktop",
      sidebarLabel: t("More Settings"),
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
};
