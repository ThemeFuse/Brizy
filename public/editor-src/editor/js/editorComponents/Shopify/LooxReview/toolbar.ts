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
      id: "toolbarLooxReview",
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
            { title: "Gallery", value: "gallery" },
            { title: "Custom Product", value: "custom" },
            { title: "Stars", value: "star" }
          ]
        },
        {
          id: "productID",
          label: t("Product"),
          type: "select",
          disabled: reviewType === "gallery",
          placeholder: t("Select Product"),
          choices: [{ title: "112233", value: "112233" }]
        },
        {
          id: "reviewLimit",
          label: t("Reviews Limit"),
          type: "slider",
          disabled: reviewType === "star"
        },
        {
          id: "withImage",
          label: t("Reviews with Photo"),
          type: "switch",
          disabled: reviewType === "star"
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
