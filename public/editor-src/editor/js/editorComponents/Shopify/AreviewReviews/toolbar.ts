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
      id: "toolbarAreviewReview",
      type: "popover",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Reviews")
      },
      options: [
        {
          id: "reviewType",
          label: t("Review Type"),
          type: "select",
          choices: [
            { title: "Carousel", value: "carousel" },
            { title: "Badge", value: "badge" },
            { title: "Product Rating", value: "productRating" },
            { title: "Product", value: "productReviews" },
            { title: "Collection Rating", value: "collectionRating" }
          ],
          helper: {
            content:
              reviewType === "collectionRating"
                ? t(
                    "Collection Rating will work only if inserted in Product Details component"
                  )
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
