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
      id: "toolbarAliExpressReview",
      type: "popover-dev",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Widgets")
      },
      options: [
        {
          id: "widgetType",
          label: t("Review Type"),
          type: "select-dev",
          placeholder: t("Select"),
          choices: [
            { title: "Stars", value: "star" },
            { title: "Widget", value: "widget" },
            { title: "Masonry", value: "featuredMasonry" },
            { title: "Carousel", value: "featuredCarousel" },
            { title: "Q & A", value: "questionAnswers" }
          ],
          helper: {
            content:
              widgetType === "questionAnswers"
                ? t("You can add only 1 element on page")
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
