import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./index";

export const getItems = ({ v }: { v: Value }): ToolbarItemType[] => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device: "desktop", state: "normal" });

  const widgetType = dvv("widgetType");
  return [
    {
      id: "toolbarLAIReview",
      type: "popover",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Reviews")
      },
      options: [
        {
          id: "widgetType",
          label: t("Review Type"),
          type: "select",
          choices: [
            { title: t("Star"), value: "star" },
            { title: t("Widget"), value: "widget" },
            { title: t("Homepage"), value: "homePageReview" },
            { title: t("Showcase"), value: "showcase" }
          ],
          helper: {
            content:
              widgetType !== "star"
                ? t(
                    "Use only one widget per page like Widget, HomePage Review, Showcase Review"
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
