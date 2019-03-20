import {
  getOptionColorHexByPalette,
  getTaxonomies
} from "visual/utils/options";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import {
  defaultValueValue,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";
import { toolbarCustomCSS } from "visual/utils/toolbar";

const getToolbarArchives = v => [
  {
    id: "toolbarPosts",
    type: "popover",
    icon: "nc-wp-shortcode",
    title: t("Archives"),
    roles: ["admin"],
    position: 80,
    options: [
      {
        id: "gridColumn",
        label: t("Columns"),
        type: "slider",
        slider: {
          min: 1,
          max: 6
        },
        input: {
          show: true,
          min: 1,
          max: 6
        },
        value: {
          value: v.gridColumn
        },
        onChange: ({ value: gridColumn }) => ({ gridColumn })
      },
      {
        id: "gridRow",
        label: t("Rows"),
        type: "slider",
        slider: {
          min: 1,
          max: 10
        },
        input: {
          show: true,
          min: 1,
          max: 10
        },
        value: {
          value: v.gridRow
        },
        onChange: ({ value: gridRow }) => ({ gridRow })
      },
      {
        id: "padding",
        label: t("Spacing"),
        type: "slider",
        slider: {
          min: 0,
          max: 100
        },
        input: {
          show: true,
          min: 0,
          max: 100
        },
        suffix: {
          show: true,
          choices: [
            {
              title: "px",
              value: "px"
            }
          ]
        },
        value: {
          value: v.padding
        },
        onChange: ({ value: padding }) => ({ padding })
      }
    ]
  }
];

const getToolbarPosts = v => [
  {
    id: "toolbarPosts",
    type: "popover",
    icon: "nc-wp-shortcode",
    title: t("Posts"),
    roles: ["admin"],
    position: 80,
    options: [
      {
        type: "tabs",
        tabs: [
          {
            label: t("Posts"),
            options: [
              {
                id: "gridColumn",
                label: t("Columns"),
                type: "slider",
                slider: {
                  min: 1,
                  max: 6
                },
                input: {
                  show: true,
                  min: 1,
                  max: 6
                },
                value: {
                  value: v.gridColumn
                },
                onChange: ({ value: gridColumn }) => ({ gridColumn })
              },
              {
                id: "gridRow",
                label: t("Rows"),
                type: "slider",
                slider: {
                  min: 1,
                  max: 10
                },
                input: {
                  show: true,
                  min: 1,
                  max: 10
                },
                value: {
                  value: v.gridRow
                },
                onChange: ({ value: gridRow }) => ({ gridRow })
              },
              {
                id: "padding",
                label: t("Spacing"),
                type: "slider",
                slider: {
                  min: 0,
                  max: 100
                },
                input: {
                  show: true,
                  min: 0,
                  max: 100
                },
                suffix: {
                  show: true,
                  choices: [
                    {
                      title: "px",
                      value: "px"
                    }
                  ]
                },
                value: {
                  value: v.padding
                },
                onChange: ({ value: padding }) => ({ padding })
              }
            ]
          },
          {
            label: t("Filter"),
            options: [
              {
                id: "taxonomy",
                label: t("Categories"),
                className: "brz-ed-option__select-taxonomy",
                type: "select",
                choices: getTaxonomies(),
                value: `${v.taxonomy}|${v.taxonomyId}`,
                onChange: _taxonomy => {
                  const [taxonomy, taxonomyId] = _taxonomy.split("|");

                  return {
                    taxonomy,
                    taxonomyId
                  };
                }
              },
              {
                id: "orderBy",
                label: t("Filter By"),
                type: "select",
                choices: [
                  { title: t("ID"), value: "ID" },
                  { title: t("Title"), value: "title" },
                  { title: t("Date"), value: "date" },
                  { title: t("Random"), value: "rand" },
                  { title: t("Comment Count"), value: "comment_count" }
                ],
                value: v.orderBy
              },
              {
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
            ]
          },
          {
            label: t("Navigation"),
            options: [
              {
                type: "multiPicker",
                picker: {
                  id: "pagination",
                  label: t("Pagination"),
                  type: "switch",
                  value: v.pagination
                },
                choices: {
                  on: [
                    {
                      id: "paginationSpacing",
                      label: t("Spacing"),
                      type: "slider",
                      slider: {
                        min: 0,
                        max: 100
                      },
                      input: {
                        show: true,
                        min: 0
                      },
                      suffix: {
                        show: true,
                        choices: [
                          {
                            title: "px",
                            value: "px"
                          }
                        ]
                      },
                      value: {
                        value: v.paginationSpacing
                      },
                      onChange: ({ value: paginationSpacing }) => ({
                        paginationSpacing
                      })
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  }
];

export function getItemsForDesktop(v) {
  const device = "desktop";

  const { hex: paginationColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "paginationColorHex", device }),
    defaultValueValue({ v, key: "paginationColorPalette", device })
  );

  return [
    ...(v.type === "archives" ? getToolbarArchives(v) : getToolbarPosts(v)),
    {
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      disabled: v.pagination === "off",
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(
            paginationColorHex,
            v.paginationColorOpacity
          )
        }
      },
      options: [
        {
          type: "tabs",
          hideHandlesWhenOne: false,
          tabs: [
            {
              label: t("Pagination"),
              options: [
                {
                  id: "paginationColor",
                  type: "colorPicker",
                  position: 10,
                  value: {
                    hex: paginationColorHex,
                    opacity: v.paginationColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
                    opacity =
                      hex !== v.paginationColorHex &&
                      v.paginationColorOpacity == 0
                        ? v.paginationTempColorOpacity
                        : opacity;

                    return {
                      paginationColorHex: hex,
                      paginationColorOpacity: opacity,
                      paginationColorPalette:
                        isChanged === "hex" ? "" : v.paginationColorPalette,

                      // Temporary Value chnges
                      paginationTempColorOpacity:
                        opacity > 0 && opacityDragEnd
                          ? opacity
                          : v.paginationTempColorOpacity
                    };
                  }
                },
                {
                  id: "paginationColorPalette",
                  type: "colorPalette",
                  position: 20,
                  value: v.paginationColorPalette,
                  onChange: paginationColorPalette => ({
                    paginationColorPalette,

                    paginationColorOpacity:
                      v.paginationColorOpacity === 0
                        ? v.paginationTempColorOpacity
                        : v.paginationColorOpacity
                  })
                },
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 100,
                      options: [
                        {
                          id: "paginationColorFields",
                          type: "colorFields",
                          position: 30,
                          value: {
                            hex: paginationColorHex,

                            opacity: v.paginationColorOpacity
                          },
                          onChange: ({ hex, opacity, isChanged }) => ({
                            paginationColorPalette:
                              isChanged === "hex"
                                ? ""
                                : v.paginationColorPalette,
                            paginationColorHex: hex,
                            paginationColorOpacity: opacity
                          })
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
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
  ];
}

export function getItemsForTablet(v) {
  return [
    {
      id: "tabletToolbarPosts",
      type: "popover",
      icon: "nc-wp-shortcode",
      title: t("Posts"),
      roles: ["admin"],
      position: 80,
      options: [
        {
          id: "tabletGridColumn",
          label: t("Columns"),
          type: "slider",
          slider: {
            min: 1,
            max: 6
          },
          input: {
            show: true,
            min: 1,
            max: 6
          },
          value: {
            value: v.tabletGridColumn
          },
          onChange: ({ value: tabletGridColumn }) => ({ tabletGridColumn })
        },
        {
          id: "tabletPadding",
          label: t("Spacing"),
          type: "slider",
          slider: {
            min: 0,
            max: 100
          },
          input: {
            show: true,
            min: 0,
            max: 100
          },
          value: {
            value: tabletSyncOnChange(v, "padding")
          },
          onChange: ({ value: tabletPadding }) => ({
            tabletPadding
          })
        }
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  return [
    {
      id: "mobileToolbarPosts",
      type: "popover",
      icon: "nc-wp-shortcode",
      title: t("Posts"),
      roles: ["admin"],
      position: 80,
      options: [
        {
          id: "mobilePadding",
          label: t("Spacing"),
          type: "slider",
          slider: {
            min: 0,
            max: 100
          },
          input: {
            show: true,
            min: 0,
            max: 100
          },
          value: {
            value: mobileSyncOnChange(v, "padding")
          },
          onChange: ({ value: mobilePadding }) => ({
            mobilePadding
          })
        }
      ]
    }
  ];
}
