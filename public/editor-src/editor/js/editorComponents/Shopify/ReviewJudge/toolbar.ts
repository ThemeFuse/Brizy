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
      id: "toolbarJudgeReview",
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
            { title: "Widget", value: "widget" },
            { title: "Carousel", value: "carousel" },
            { title: "Badge", value: "badge" }
          ],
          helper: {
            content:
              reviewType === "badge"
                ? t(
                    "Badge will work only if inserted in Product Details component"
                  )
                : ""
          }
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
