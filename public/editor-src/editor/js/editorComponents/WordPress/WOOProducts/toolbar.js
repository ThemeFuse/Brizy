import { t } from "visual/utils/i18n";

export default taxonomies => {
  const categoriesList = taxonomies.map(item => ({
    title: item.name,
    value: item.slug
  }));

  return {
    getItemsForDesktop: getItemsForDesktop(categoriesList),
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
                value: v.limit
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
                  value: v.order,
                }
              },
            ]
          },
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
        onChange: ({ value: width }) => {
          return {
            width,
            mobileWidth: v.width === v.mobileWidth ? width : v.mobileWidth
          };
        }
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
          value: v.mobileWidth
        },
        onChange: ({ value: mobileWidth }) => {
          return {
            mobileWidth
          };
        }
      }
    ]
  }
];
