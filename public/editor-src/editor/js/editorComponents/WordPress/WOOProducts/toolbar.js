import { t } from "visual/utils/i18n";

export default taxonomies => {
  return {
    getItems: getItems(taxonomies)
  };
};

const getItems = taxonomies => () => {
  return [
    {
      id: "toolbarWOOProducts",
      type: "popover-dev",
      config: {
        icon: "nc-woo-products",
        title: t("Shop Products")
      },
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "WOOProductsTabs",
          type: "tabs-dev",
          tabs: [
            {
              id: "layoutTab",
              label: t("Layout"),
              options: [
                {
                  id: "columns",
                  label: t("Columns"),
                  type: "slider-dev",
                  config: {
                    min: 1,
                    max: 6,
                    inputMin: 1,
                    inputMax: 6
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
                  choices: [
                    {
                      title: t("All"),
                      value: ""
                    },
                    ...taxonomies.map(item => ({
                      title: item.name,
                      value: item.slug
                    }))
                  ]
                },
                {
                  id: "orderBy",
                  label: t("Filter By"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    { title: t("Random"), value: "name" },
                    { title: t("Title"), value: "title" },
                    { title: t("Date"), value: "date" },
                    { title: t("Rating"), value: "rating" },
                    { title: t("Popularity"), value: "popularity" },
                    { title: t("Menu Order"), value: "menu_order" },
                    { title: t("Random"), value: "rand" },
                    { title: t("ID"), value: "id" }
                  ]
                },
                {
                  id: "order",
                  devices: "desktop",
                  label: t("Order"),
                  type: "radioGroup-dev",
                  choices: [
                    { value: "ASC", icon: "nc-up" },
                    { value: "DESC", icon: "nc-down" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog"
      },
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
          id: "grid",
          type: "grid",
          separator: true,
          columns: [
            {
              id: "grid-settings",
              width: 50,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "grid-effects",
              width: 50,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
