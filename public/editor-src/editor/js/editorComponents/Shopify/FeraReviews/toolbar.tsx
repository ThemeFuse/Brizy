import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "toolbarFeraReview",
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
          type: "select-dev",
          label: t("Reviews Type"),
          choices: [
            { title: "Product", value: "product" },
            { title: "Testimonial Carousel", value: "testimonial" },
            { title: "All Reviews", value: "allReviews" },
            { title: "Average Rating", value: "averageRating" },
            { title: "Avg. Store Rating", value: "avgStoreRating" },
            { title: "Logo Showcase Banner", value: "banner" },
            { title: "Product Page Media", value: "ppMedia" },
            { title: "In Store Media", value: "inStoreMedia" },
            { title: "Product Page Counter", value: "ppCounter" },
            { title: "Collection Page Counter", value: "cpCounter" },
            { title: "Product Page Event Feed", value: "ppEventFeed" },
            { title: "General Event Feed", value: "generalEventFeed" },
            { title: "Event Popups", value: "eventPopups" }
          ]
        },
        {
          id: "htmlTag",
          label: t("HTML Tag"),
          type: "inputText-dev",
          placeholder: "<div data-fera..."
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
