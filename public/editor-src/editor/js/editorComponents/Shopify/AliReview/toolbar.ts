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
      id: "toolbarAliReview",
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
          config: { size: "large" },
          choices: [
            { title: "Product Rating Star", value: "prodRatingStar" },
            { title: "Collection Rating Star", value: "collRatingStar" },
            { title: "Review Box", value: "reviewBox" },
            { title: "Carousel Slider", value: "carousel" }
          ]
        },
        {
          id: "productSource",
          label: t("Custom Product"),
          type: "select",
          placeholder: t("No product selected"),
          disabled: reviewType !== "collRatingStar",
          choices: [{ title: "112222", value: "112233" }]
        },
        {
          id: "widgetType",
          label: t("Widget List"),
          type: "select",
          disabled: reviewType !== "carousel",
          //need to buy a pro plan for widgets
          choices: [{ title: "No Data", value: "no_data" }]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      position: 110,
      title: t("Settings")
    }
  ];
};
