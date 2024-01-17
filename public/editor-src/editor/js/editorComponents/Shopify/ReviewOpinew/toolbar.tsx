import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./index";

export const getItems = ({ v }: { v: Value }): ToolbarItemType[] => {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device: "desktop", state: "normal" });

  const reviewType = dvv("reviewType");

  return [
    {
      id: "toolbarVitalsReview",
      type: "popover",
      config: {
        size: "auto",
        title: t("Reviews"),
        icon: "nc-shopify-logo"
      },
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "reviewType",
          label: "Review Type",
          type: "select",
          choices: [
            { title: "Widget", value: "default" },
            { title: "All Store", value: "allReviews" },
            { title: "Product", value: "productReview" },
            { title: "Collection Star", value: "collectionReviewStar" },
            { title: "Average Store", value: "avgStoreReview" }
          ]
        },
        {
          id: "badgeSize",
          label: "Badge Size",
          type: "select",
          disabled: reviewType !== "avgStoreReview",
          choices: [
            { title: "Wide Average", value: "average" },
            { title: "Small", value: "small" },
            { title: "Wide", value: "wide" }
          ]
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
