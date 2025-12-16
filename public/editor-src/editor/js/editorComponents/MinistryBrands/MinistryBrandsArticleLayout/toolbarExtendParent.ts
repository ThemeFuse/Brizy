import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEkklesiaChoiches } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { toolbarParentColors } from "../toolbarParent";
import { Props, Value } from "./utils/types";

export const getItems: GetItems<Value, Props> = (data) => {
  const { v, component } = data;
  const config = component.getGlobalConfig();

  const {
    showCategoryFilter,
    addCategoryFilter,
    addCategoryFilter2,
    addCategoryFilter3,
    detailPage,
    showGroupFilter,
    showSeriesFilter,
    showAuthorFilter,
    showSearch
  } = v;

  const isNotCategoryFilter = showCategoryFilter === "off";
  const isNotExtraCategory1Filter = addCategoryFilter === "off";
  const isNotExtraCategory2Filter = addCategoryFilter2 === "off";
  const isNotExtraCategory3Filter = addCategoryFilter3 === "off";

  return [
    {
      id: "toolbarArticleLayout",
      type: "popover",
      config: {
        icon: "t2-article-layout",
        title: t("Article Layout")
      },
      position: 10,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          config: {
            saveTab: true
          },
          devices: "desktop",
          tabs: [
            {
              id: "tabColumns",
              label: t("Columns"),
              options: [
                {
                  id: "countPerPage",
                  label: t("Items"),
                  type: "number",
                  devices: "desktop",
                  config: {
                    min: 1,
                    max: 24,
                    spinner: true
                  }
                },
                {
                  id: "columnNumber",
                  label: t("Columns"),
                  type: "number",
                  config: {
                    min: 1,
                    max: 6,
                    spinner: true
                  }
                }
              ]
            },
            {
              id: "tabLayoutSettings",
              label: t("Display"),
              options: [
                {
                  id: "showMetaIcons",
                  label: t("Meta Icons"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showImages",
                  type: "switch",
                  label: t("Images")
                },
                {
                  id: "showVideo",
                  type: "switch",
                  label: t("Video"),
                  helper: {
                    content: t(
                      "If this is selected and you would like the image to be a fallback when no video is available make sure to select 'Display Images'."
                    )
                  }
                },
                {
                  id: "showAudio",
                  type: "switch",
                  label: t("Audio")
                },
                {
                  id: "showMediaLinks",
                  type: "switch",
                  label: t("Media Links")
                },
                {
                  id: "showTitle",
                  type: "switch",
                  label: t("Title")
                },
                {
                  id: "showDate",
                  type: "switch",
                  label: t("Date")
                },
                {
                  id: "showCategory",
                  type: "switch",
                  label: t("Category")
                },
                {
                  id: "showGroups",
                  type: "switch",
                  label: t("Groups")
                },
                {
                  id: "showSeries",
                  type: "switch",
                  label: t("Series")
                },
                {
                  id: "showAuthor",
                  type: "switch",
                  label: t("Author")
                },
                {
                  id: "showMetaHeadings",
                  type: "switch",
                  label: t("Meta Headings")
                },
                {
                  id: "showPreview",
                  type: "switch",
                  label: t("Preview")
                },
                {
                  id: "showPagination",
                  type: "switch",
                  label: t("Pagination")
                }
              ]
            },
            {
              id: "page",
              label: t("Page"),
              options: [
                {
                  id: "detailPage",
                  type: "internalLink",
                  label: t("Item"),
                  devices: "desktop",
                  config: {
                    helper: t(
                      'URL of article detail page. If used will add a link to the heading to take the user to the article detail page. Requires the "Article Detail" widget to be placed on a page and that page url/slug placed in this field.'
                    )
                  }
                },
                {
                  id: "detailButtonText",
                  type: "inputText",
                  label: t("Detail Button"),
                  placeholder: t("Button name..."),
                  devices: "desktop",
                  disabled: !detailPage,
                  config: {
                    size: "medium"
                  },
                  helper: {
                    content: t(
                      "Button will display if text is entered and a detail page selected."
                    )
                  }
                }
              ]
            },
            {
              id: "tabFilterSettings",
              label: t("Filter"),
              options: [
                {
                  id: "parentCategory",
                  label: t("Parent Category"),
                  type: "select",
                  choices: getEkklesiaChoiches(config, {
                    key: "articlesLvl",
                    subKey: "parents"
                  }),
                  helper: {
                    content: t(
                      "Defines which level 1 category to use as a base for the layout."
                    )
                  }
                },
                {
                  id: "categoryGroup",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "showCategoryFilter",
                      type: "switch",
                      label: t("Category")
                    },
                    {
                      id: "categoryFilterParent",
                      type: "select",
                      label: t("Parent"),
                      disabled: isNotCategoryFilter,
                      choices: getEkklesiaChoiches(config, {
                        key: "articlesLvl",
                        subKey: "childs"
                      }),
                      helper: {
                        content: t(
                          "Defines which level 2 category for this specific filter. If selected will show the next level of categories as select options. If a Parent Category is selected above make sure to select a child category of that parent."
                        )
                      }
                    },
                    {
                      id: "categoryFilterHeading",
                      type: "inputText",
                      label: t("Heading"),
                      disabled: isNotCategoryFilter,
                      config: {
                        size: "medium"
                      }
                    }
                  ]
                },
                {
                  id: "showGroupGroup",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "showGroupFilter",
                      type: "switch",
                      label: t("Group")
                    },
                    {
                      id: "groupFilterHeading",
                      type: "inputText",
                      label: t("Heading"),
                      disabled: showGroupFilter === "off",
                      config: {
                        size: "medium"
                      }
                    }
                  ]
                },
                {
                  id: "showGroupSeries",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "showSeriesFilter",
                      type: "switch",
                      label: t("Series")
                    },
                    {
                      id: "seriesFilterHeading",
                      type: "inputText",
                      label: t("Heading"),
                      disabled: showSeriesFilter === "off",
                      config: {
                        size: "medium"
                      }
                    }
                  ]
                },
                {
                  id: "showGroupAuthor",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "showAuthorFilter",
                      type: "switch",
                      label: t("Author")
                    },
                    {
                      id: "authorFilterHeading",
                      type: "inputText",
                      label: t("Heading"),
                      disabled: showAuthorFilter === "off",
                      config: {
                        size: "medium"
                      }
                    }
                  ]
                },
                {
                  id: "showGroupSearch",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "showSearch",
                      type: "switch",
                      label: t("Search")
                    },
                    {
                      id: "searchPlaceholder",
                      type: "inputText",
                      label: t("Placeholder"),
                      disabled: showSearch === "off",
                      config: {
                        size: "medium"
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "tabAdvanced",
              label: t("Advanced"),
              options: [
                {
                  id: "addCategoryGroup",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "addCategoryFilter",
                      type: "switch",
                      label: t("Add Category Filter"),
                      devices: "desktop"
                    },
                    {
                      id: "addCategoryFilterParent",
                      type: "select",
                      label: t("Parent"),
                      devices: "desktop",
                      disabled: isNotExtraCategory1Filter,
                      choices: getEkklesiaChoiches(config, {
                        key: "articlesLvl",
                        subKey: "childs"
                      }),
                      helper: {
                        content: t(
                          "Additional category filters require this selection. Defines which level 2 category for this specific filter. If selected will show the next level of categories as select options. If a Parent Category is selected above make sure to select a child category of that parent."
                        )
                      }
                    },
                    {
                      id: "addCategoryFilterHeading",
                      type: "inputText",
                      label: t("Heading"),
                      devices: "desktop",
                      disabled: isNotExtraCategory1Filter,
                      config: {
                        size: "medium"
                      }
                    }
                  ]
                },

                {
                  id: "addCategoryGroup2",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "addCategoryFilter2",
                      type: "switch",
                      label: t("Add Category Filter"),
                      devices: "desktop"
                    },
                    {
                      id: "addCategoryFilterParent2",
                      type: "select",
                      label: t("Parent"),
                      devices: "desktop",
                      disabled: isNotExtraCategory2Filter,
                      choices: getEkklesiaChoiches(config, {
                        key: "articlesLvl",
                        subKey: "childs"
                      }),
                      helper: {
                        content: t(
                          "Additional category filters require this selection. Defines which level 2 category for this specific filter. If selected will show the next level of categories as select options. If a Parent Category is selected above make sure to select a child category of that parent."
                        )
                      }
                    },
                    {
                      id: "addCategoryFilterHeading2",
                      type: "inputText",
                      label: t("Heading"),
                      devices: "desktop",
                      disabled: isNotExtraCategory2Filter,
                      config: {
                        size: "medium"
                      }
                    }
                  ]
                },
                {
                  id: "addCategoryGroup3",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "addCategoryFilter3",
                      type: "switch",
                      label: t("Add Category Filter"),
                      devices: "desktop"
                    },
                    {
                      id: "addCategoryFilterParent3",
                      type: "select",
                      label: t("Parent"),
                      devices: "desktop",
                      disabled: isNotExtraCategory3Filter,
                      choices: getEkklesiaChoiches(config, {
                        key: "articlesLvl",
                        subKey: "childs"
                      }),
                      helper: {
                        content: t(
                          "Additional category filters require this selection. Defines which level 2 category for this specific filter. If selected will show the next level of categories as select options. If a Parent Category is selected above make sure to select a child category of that parent."
                        )
                      }
                    },
                    {
                      id: "addCategoryFilterHeading3",
                      type: "inputText",
                      label: t("Heading"),
                      devices: "desktop",
                      disabled: isNotExtraCategory3Filter,
                      config: {
                        size: "medium"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    ...toolbarParentColors<Value, Props>(data),
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true,
      choices: []
    },
    {
      id: "itemHorizontalAlign",
      type: "toggle",
      position: 80,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "itemSpacing",
          label: t("Spacing"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "metaItemSpacing",
          label: t("Items Spacing"),
          type: "slider",
          config: {
            min: 0,
            max: 150,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "grid",
          type: "grid",
          config: {
            separator: true
          },
          columns: [
            {
              id: "col-1",
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "col-2",
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton",
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
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      disabled: true
    }
  ];
};
