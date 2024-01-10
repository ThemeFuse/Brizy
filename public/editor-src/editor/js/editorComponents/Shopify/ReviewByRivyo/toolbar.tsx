import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./index";

export const getItems = ({ v }: { v: Value }): ToolbarItemType[] => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device: "desktop", state: "normal" });

  const reviewType = dvv("reviewType");
  return [
    {
      id: "toolbarReviewByRivyo",
      type: "popover",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Review")
      },
      options: [
        {
          id: "reviewType",
          label: t("Review Type"),
          type: "select",
          choices: [
            { title: "Widget", value: "reviewWidget" },
            { title: "All Store", value: "allStore" },
            { title: "Avg. Star Rating", value: "averageRating" }
          ]
        },
        {
          id: "productSource",
          label: t("Product Source"),
          type: "select",
          disabled: reviewType === "allStore",
          choices: [{ title: "Auto", value: "auto" }]
        }
      ]
    },
    { id: "horizontalAlign", type: "toggle", disabled: true, choices: [] },
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
