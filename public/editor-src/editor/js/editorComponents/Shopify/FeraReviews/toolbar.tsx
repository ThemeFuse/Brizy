import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { makeAttr } from "visual/utils/i18n/attribute";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "toolbarFeraReview",
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
          type: "select",
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
          type: "inputText",
          placeholder: `<div ${makeAttr("fera...")}`
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
