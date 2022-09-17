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
      type: "popover-dev",
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
          type: "select-dev",
          choices: [
            { title: "Gallery", value: "gallery" },
            { title: "Custom Product", value: "custom" },
            { title: "Stars", value: "star" }
          ]
        },
        {
          id: "productID",
          label: t("Product"),
          type: "select-dev",
          disabled: reviewType === "gallery",
          placeholder: t("Select Product"),
          choices: [{ title: "112233", value: "112233" }]
        },
        {
          id: "reviewLimit",
          label: t("Reviews Limit"),
          type: "slider-dev",
          disabled: reviewType === "star"
        },
        {
          id: "withImage",
          label: t("Reviews with Photo"),
          type: "switch-dev",
          disabled: reviewType === "star"
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
