import { t } from "visual/utils/i18n";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import { toolbarCustomCSS } from "visual/utils/toolbar";

export default taxonomies => {
  const categoriesList = taxonomies.map(item => ({
    title: item.name,
    value: item.slug
  }));

  return {
    getItemsForDesktop: getItemsForDesktop(categoriesList),
    getItemsForTablet,
    getItemsForMobile
  };
};

const getItemsForDesktop = categoriesList => v => [
  {
    id: "toolbarWOOProducts",
    type: "popover",
    icon: "nc-woo-2",
    position: 10,
    options: [
      {
        id: "WOOProductsTabs",
        type: "tabs",
        tabs: [
          {
            id: "layoutTab",
            label: t("Layout"),
            options: [
              {
                id: "columns",
                label: t("Columns"),
                type: "select",
                className: "brz-control__select--small",
                choices: [
                  { title: "1", value: 1 },
                  { title: "2", value: 2 },
                  { title: "3", value: 3 },
                  { title: "4", value: 4 },
                  { title: "5", value: 5 },
                  { title: "6", value: 6 }
                ],
                value: v.columns
              },
              {
                id: "limit",
                label: t("Products Count"),
                type: "input",
                inputSize: "small",
                value: {
                  value: v.limit
                },
                onChange: ({ value: limit }) => ({
                  limit
                })
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
                type: "select",
                choices: categoriesList,
                value: v.category
              },
              {
                id: "orderBy",
                label: t("Filter By"),
                type: "select",
                choices: [
                  { title: t("Title"), value: "title" },
                  { title: t("Date"), value: "date" },
                  { title: t("Rating"), value: "rating" },
                  { title: t("Popularity"), value: "popularity" },
                  { title: t("Menu Order"), value: "menu_order" },
                  { title: t("Random"), value: "rand" },
                  { title: t("ID"), value: "id" }
                ],
                value: v.orderBy
              },
              {
                type: "multiPicker",
                picker: {
                  id: "order",
                  label: t("Order"),
                  type: "radioGroup",
                  choices: [
                    {
                      value: "ASC",
                      icon: "nc-up"
                    },
                    {
                      value: "DESC",
                      icon: "nc-down"
                    }
                  ],
                  value: v.order
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "toolbarSettings",
    type: "popover",
    icon: "nc-cog",
    roles: ["admin"],
    position: 110,
    options: [
      {
        id: "width",
        label: t("Width"),
        type: "slider",
        slider: {
          min: 1,
          max: 100
        },
        input: {
          show: true
        },
        suffix: {
          show: true,
          choices: [
            {
              title: "%",
              value: "%"
            }
          ]
        },
        value: {
          value: v.width
        },
        onChange: ({ value: width }) => ({ width })
      },
      {
        id: "advancedSettings",
        type: "advancedSettings",
        label: t("More Settings"),
        icon: "nc-cog",
        options: [
          {
            id: "settingsTabs",
            type: "tabs",
            align: "start",
            tabs: [
              {
                id: "settingsStyling",
                label: t("Styling"),
                tabIcon: "nc-styling",
                options: []
              },
              {
                id: "moreSettingsAdvanced",
                label: t("Advanced"),
                tabIcon: "nc-cog",
                options: []
              }
            ]
          }
        ]
      }
    ]
  }
];

const getItemsForTablet = v => [
  {
    id: "tabletToolbarSettings",
    type: "popover",
    roles: ["admin"],
    icon: "nc-cog",
    position: 110,
    options: [
      {
        id: "tabletWidth",
        label: t("Width"),
        type: "slider",
        slider: {
          min: 1,
          max: 100
        },
        input: {
          show: true
        },
        suffix: {
          show: true,
          choices: [
            {
              title: "%",
              value: "%"
            }
          ]
        },
        value: {
          value: tabletSyncOnChange(v, "width")
        },
        onChange: ({ value: tabletWidth }) => ({ tabletWidth })
      }
    ]
  }
];

const getItemsForMobile = v => [
  {
    id: "mobileToolbarSettings",
    type: "popover",
    roles: ["admin"],
    icon: "nc-cog",
    position: 110,
    options: [
      {
        id: "mobileWidth",
        label: t("Width"),
        type: "slider",
        slider: {
          min: 1,
          max: 100
        },
        input: {
          show: true
        },
        suffix: {
          show: true,
          choices: [
            {
              title: "%",
              value: "%"
            }
          ]
        },
        value: {
          value: mobileSyncOnChange(v, "width")
        },
        onChange: ({ value: mobileWidth }) => ({ mobileWidth })
      }
    ]
  }
];
