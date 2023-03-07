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
      type: "popover-dev",
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
          type: "select-dev",
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
