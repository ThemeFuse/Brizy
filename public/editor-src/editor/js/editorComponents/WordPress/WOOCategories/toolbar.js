import { t } from "visual/utils/i18n";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import { toolbarCustomCSS } from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  return [
    {
      id: "toolbarWOOCategories",
      type: "popover",
      icon: "nc-woo-2",
      position: 10,
      options: [
        {
          id: "WOOCategoriesTabs",
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
                  id: "number",
                  label: t("Categories Count"),
                  type: "input",
                  inputSize: "small",
                  value: {
                    value: v.number
                  },
                  onChange: ({ value: number }) => ({
                    number
                  })
                }
              ]
            },
            {
              id: "orderTab",
              label: t("Filter"),
              options: [
                {
                  id: "orderBy",
                  label: t("Filter By"),
                  type: "select",
                  choices: [
                    { title: t("Name"), value: "name" },
                    { title: t("Slug"), value: "slug" },
                    { title: t("Description"), value: "description" },
                    { title: t("Count"), value: "count" }
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
      roles: ["admin"],
      icon: "nc-cog",
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
}

export function getItemsForTablet(v) {
  return [
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
}

export function getItemsForMobile(v) {
  return [
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
}
