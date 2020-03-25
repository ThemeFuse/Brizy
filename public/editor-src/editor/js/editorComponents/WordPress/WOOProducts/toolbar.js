import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import { toolbarElementWOOProductsOrder } from "visual/utils/toolbar";

export default taxonomies => {
  return {
    getItems: getItems(taxonomies)
  };
};

const getItems = taxonomies => ({ v, device }) => {
  const dvk = key => defaultValueKey({ key, device });

  return [
    {
      id: dvk("toolbarWOOProducts"),
      type: "popover",
      devices: "desktop",
      icon: "nc-woo-2",
      position: 10,
      options: [
        {
          id: dvk("WOOProductsTabs"),
          type: "tabs",
          tabs: [
            {
              id: dvk("layoutTab"),
              label: t("Layout"),
              options: [
                {
                  id: "columns",
                  label: t("Columns"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    { title: "1", value: 1 },
                    { title: "2", value: 2 },
                    { title: "3", value: 3 },
                    { title: "4", value: 4 },
                    { title: "5", value: 5 },
                    { title: "6", value: 6 }
                  ],
                  config: {
                    size: "small"
                  }
                },
                {
                  id: "limit",
                  label: t("Products Count"),
                  type: "inputText-dev",
                  devices: "desktop",
                  config: {
                    size: "short"
                  }
                }
              ]
            },
            {
              id: "filterTab",
              label: t("Filter"),
              options: [
                {
                  id: "category",
                  label: t("Categories"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: taxonomies.map(item => ({
                    title: item.name,
                    value: item.slug
                  }))
                },
                {
                  id: "orderBy",
                  label: t("Filter By"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    { title: t("Title"), value: "title" },
                    { title: t("Date"), value: "date" },
                    { title: t("Rating"), value: "rating" },
                    { title: t("Popularity"), value: "popularity" },
                    { title: t("Menu Order"), value: "menu_order" },
                    { title: t("Random"), value: "rand" },
                    { title: t("ID"), value: "id" }
                  ]
                },
                toolbarElementWOOProductsOrder({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: dvk("toolbarSettings"),
      type: "popover",
      icon: "nc-cog",
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: dvk("advancedSettings"),
          type: "advancedSettings",
          devices: "desktop",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
};
