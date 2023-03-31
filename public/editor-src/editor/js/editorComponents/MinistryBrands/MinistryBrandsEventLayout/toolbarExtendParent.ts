import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { toolbarParentColors } from "../toolbarParent";
import { getEkklesiaChoiches } from "../utils/helpers";
import type { Props, Value } from "./types";

// @ts-expect-error advancedSettings old option
export const getItems: GetItems<Value, Props> = ({
  v,
  device,
  state,
  component,
  context
}) => {
  const isNotFeaturedView = v.showFeaturedView === "off";
  const isNotListView = v.showListView === "off";
  const isNotCalendarView = v.showCalendarView === "off";
  const isNotCategoryFilter = v.showCategoryFilter === "off";
  const isNotExtraCategory1Filter = v.addCategoryFilter === "off";
  const isNotExtraCategory2Filter = v.addCategoryFilter2 === "off";
  const isNotExtraCategory3Filter = v.addCategoryFilter3 === "off";

  const _config = Config.getAll();
  const { apiUrl } = _config.modules?.ekklesia ?? {};
  const { getSourceChoices } = _config.api?.sourceTypes ?? {};

  return [
    {
      id: "toolbarEventLayout",
      type: "popover-dev",
      config: {
        icon: "t2-event-layout",
        title: t("Event Layout")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabColumns",
              label: t("Columns"),
              options: [
                {
                  id: "howManyFeatured",
                  label: t("Items"),
                  type: "number-dev",
                  disabled: isNotFeaturedView,
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
                  type: "number-dev",
                  disabled: isNotFeaturedView,
                  config: {
                    min: 1,
                    max: 6,
                    spinner: true
                  }
                }
              ]
            },
            {
              id: "tabEventLayout",
              label: t("Display"),
              options: [
                // Featured View Group
                {
                  id: "featuredViewGroup",
                  type: "group-dev",
                  devices: "desktop",
                  options: [
                    {
                      id: "showFeaturedView",
                      label: t("Featured View"),
                      type: "switch-dev",
                      devices: "desktop"
                    },
                    {
                      id: "featuredViewOrder",
                      label: t("Order"),
                      type: "number-dev",
                      disabled: isNotFeaturedView,
                      config: {
                        min: 1,
                        max: 3,
                        spinner: true
                      },
                      helper: {
                        content: t(
                          "The featured view default is the first position. If you change the order make sure the other view positions are updated to be unique."
                        )
                      }
                    },
                    {
                      id: "featuredViewHeading",
                      label: t("Heading"),
                      type: "inputText-dev",
                      disabled: isNotFeaturedView
                    },
                    {
                      id: "showFeaturedImages",
                      label: t("Images"),
                      type: "switch-dev",
                      disabled: isNotFeaturedView
                    },
                    {
                      id: "showFeaturedPreview",
                      label: t("Preview"),
                      type: "switch-dev",
                      disabled: isNotFeaturedView
                    },
                    {
                      id: "showFeaturedTitle",
                      label: t("Title"),
                      type: "switch-dev",
                      disabled: isNotFeaturedView
                    },
                    {
                      id: "showFeaturedDate",
                      label: t("Date"),
                      type: "switch-dev",
                      disabled: isNotFeaturedView
                    }
                  ]
                },
                // List View Group
                {
                  id: "listViewGroup",
                  type: "group-dev",
                  devices: "desktop",
                  options: [
                    {
                      id: "showListView",
                      label: t("List View"),
                      type: "switch-dev",
                      devices: "desktop"
                    },
                    {
                      id: "listViewOrder",
                      label: t("Order"),
                      type: "number-dev",
                      disabled: isNotListView,
                      config: {
                        min: 1,
                        max: 3,
                        spinner: true
                      },
                      helper: {
                        content: t(
                          "The list view default is the second position. If you change the order make sure the other view positions are updated to be unique."
                        )
                      }
                    },
                    {
                      id: "listViewHeading",
                      label: t("Heading"),
                      type: "inputText-dev",
                      disabled: isNotListView
                    }
                  ]
                },
                // Calendar View Group
                {
                  id: "calendarViewGroup",
                  type: "group-dev",
                  devices: "desktop",
                  options: [
                    {
                      id: "showCalendarView",
                      label: t("Calendar View"),
                      type: "switch-dev",
                      devices: "desktop"
                    },
                    {
                      id: "calendarViewOrder",
                      label: t("Order"),
                      type: "number-dev",
                      disabled: isNotCalendarView,
                      config: {
                        min: 1,
                        max: 3,
                        spinner: true
                      },
                      helper: {
                        content: t(
                          "The calendar view default is the third position. If you change the order make sure the other view positions are updated to be unique."
                        )
                      }
                    },
                    {
                      id: "calendarViewHeading",
                      label: t("Heading"),
                      type: "inputText-dev",
                      disabled: isNotCalendarView
                    }
                  ]
                },
                {
                  id: "howmanymonths",
                  type: "number-dev",
                  label: t("Months"),
                  devices: "desktop"
                }
              ]
            },
            {
              id: "page",
              label: t("Page"),
              options: [
                {
                  id: "source",
                  type: "select-dev",
                  label: t("Type"),
                  devices: "desktop",
                  choices: getSourceChoices?.() ?? [],
                  config: {
                    size: "large"
                  },
                  helper: {
                    content: t(
                      'URL of event detail page. If used a link to the heading and an image will be added to take the user to the event detail page. Requires the "Event Detail" widget to be placed on a page and that page url/slug placed in this field.'
                    )
                  }
                },
                {
                  id: "eventDetailPage",
                  type: "internalLink-dev",
                  label: t("Item"),
                  devices: "desktop",
                  disabled: !v.source,
                  config: {
                    postType: v.source
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
                  type: "select-dev",
                  devices: "desktop",
                  choices: getEkklesiaChoiches({
                    key: "eventsLvl",
                    subKey: "parents",
                    url: apiUrl
                  }),
                  helper: {
                    content: t(
                      "Defines which level 1 category to use as a base for the layout."
                    )
                  }
                },
                // Category Group
                {
                  id: "categoryGroup",
                  type: "group-dev",
                  devices: "desktop",
                  options: [
                    {
                      id: "showCategoryFilter",
                      type: "switch-dev",
                      label: t("Category"),
                      devices: "desktop"
                    },
                    {
                      id: "categoryFilterParent",
                      type: "select-dev",
                      label: t("Parent"),
                      devices: "desktop",
                      disabled: isNotCategoryFilter,
                      choices: getEkklesiaChoiches({
                        key: "eventsLvl",
                        subKey: "childs",
                        url: apiUrl
                      }),
                      helper: {
                        content: t(
                          "Defines which level 2 category for this specific filter. If selected will show the next level of categories as select options. If a Parent Category is selected above make sure to select a child category of that parent."
                        )
                      }
                    },
                    {
                      id: "categoryFilterList",
                      type: "inputText-dev",
                      label: t("List"),
                      devices: "desktop",
                      disabled: isNotCategoryFilter,
                      helper: {
                        content: t(
                          "This should be a comma separate list of category slugs without spaces eg. if you wanted to use the categories 'Category Example 1' and 'Category Example 2' the list would be 'category-example-1,category-example-2'. This option removes the parent filter options."
                        )
                      }
                    },
                    {
                      id: "categoryFilterHeading",
                      type: "inputText-dev",
                      label: t("Heading"),
                      devices: "desktop",
                      disabled: isNotCategoryFilter
                    }
                  ]
                },
                // showGroup Group
                {
                  id: "showGroupGroup",
                  type: "group-dev",
                  devices: "desktop",
                  options: [
                    {
                      id: "showGroupFilter",
                      type: "switch-dev",
                      label: t("Group"),
                      devices: "desktop"
                    },
                    {
                      id: "groupFilterHeading",
                      type: "inputText-dev",
                      label: t("Heading"),
                      devices: "desktop",
                      disabled: v.showGroupFilter === "off"
                    }
                  ]
                },
                // showSearch Group
                {
                  id: "showGroupSearch",
                  type: "group-dev",
                  devices: "desktop",
                  options: [
                    {
                      id: "showSearch",
                      type: "switch-dev",
                      label: t("Search"),
                      devices: "desktop"
                    },
                    {
                      id: "searchPlaceholder",
                      type: "inputText-dev",
                      label: t("Placeholder"),
                      devices: "desktop",
                      disabled: v.showSearch === "off"
                    }
                  ]
                }
              ]
            },
            {
              id: "tabAdvanced",
              label: t("Advanced"),
              options: [
                // Add Category Group
                {
                  id: "addCategoryGroup",
                  type: "group-dev",
                  devices: "desktop",
                  options: [
                    {
                      id: "addCategoryFilter",
                      type: "switch-dev",
                      label: t("Add Category Filter"),
                      devices: "desktop"
                    },
                    {
                      id: "addCategoryFilterParent",
                      type: "select-dev",
                      label: t("Parent"),
                      devices: "desktop",
                      disabled: isNotExtraCategory1Filter,
                      choices: getEkklesiaChoiches({
                        key: "eventsLvl",
                        subKey: "childs",
                        url: apiUrl
                      }),

                      helper: {
                        content: t(
                          "Additional category filters require this selection. Defines which level 2 category for this specific filter. If selected will show the next level of categories as select options. If a Parent Category is selected above make sure to select a child category of that parent."
                        )
                      }
                    },
                    {
                      id: "addCategoryFilterList",
                      type: "inputText-dev",
                      label: t("List"),
                      devices: "desktop",
                      disabled: isNotExtraCategory1Filter,
                      helper: {
                        content: t(
                          'This should be a comma separate list of category slugs without spaces eg. if you wanted to use the categories "Category Example 1" and "Category Example 2" the list would be "category-example-1,category-example-2". This option removes the parent filter options.'
                        )
                      }
                    },
                    {
                      id: "addCategoryFilterHeading",
                      type: "inputText-dev",
                      label: t("Heading"),
                      devices: "desktop",
                      disabled: isNotExtraCategory1Filter
                    }
                  ]
                },
                {
                  id: "addCategoryGroup2",
                  type: "group-dev",
                  devices: "desktop",
                  options: [
                    {
                      id: "addCategoryFilter2",
                      type: "switch-dev",
                      label: t("Add Category Filter 2"),
                      devices: "desktop"
                    },
                    {
                      id: "addCategoryFilterParent2",
                      type: "select-dev",
                      label: t("Parent"),
                      devices: "desktop",
                      disabled: isNotExtraCategory2Filter,
                      choices: getEkklesiaChoiches({
                        key: "eventsLvl",
                        subKey: "childs",
                        url: apiUrl
                      }),
                      helper: {
                        content: t(
                          "Additional category filters require this selection. Defines which level 2 category for this specific filter. If selected will show the next level of categories as select options. If a Parent Category is selected above make sure to select a child category of that parent."
                        )
                      }
                    },
                    {
                      id: "addCategoryFilterList2",
                      type: "inputText-dev",
                      label: t("List"),
                      devices: "desktop",
                      disabled: isNotExtraCategory2Filter,
                      helper: {
                        content: t(
                          'This should be a comma separate list of category slugs without spaces eg. if you wanted to use the categories "Category Example 1" and "Category Example 2" the list would be "category-example-1,category-example-2". This option removes the parent filter options.'
                        )
                      }
                    },
                    {
                      id: "addCategoryFilterHeading2",
                      type: "inputText-dev",
                      label: t("Heading"),
                      devices: "desktop",
                      disabled: isNotExtraCategory2Filter
                    }
                  ]
                },

                {
                  id: "addCategoryGroup3",
                  type: "group-dev",
                  devices: "desktop",
                  options: [
                    {
                      id: "addCategoryFilter3",
                      type: "switch-dev",
                      label: t("Add Category Filter 3"),
                      devices: "desktop"
                    },
                    {
                      id: "addCategoryFilterParent3",
                      type: "select-dev",
                      label: t("Parent"),
                      devices: "desktop",
                      disabled: isNotExtraCategory3Filter,
                      choices: getEkklesiaChoiches({
                        key: "eventsLvl",
                        subKey: "childs",
                        url: apiUrl
                      }),
                      helper: {
                        content: t(
                          "Additional category filters require this selection. Defines which level 2 category for this specific filter. If selected will show the next level of categories as select options. If a Parent Category is selected above make sure to select a child category of that parent."
                        )
                      }
                    },
                    {
                      id: "addCategoryFilterList3",
                      type: "inputText-dev",
                      label: t("List"),
                      devices: "desktop",
                      disabled: isNotExtraCategory3Filter,
                      helper: {
                        content: t(
                          'This should be a comma separate list of category slugs without spaces eg. if you wanted to use the categories "Category Example 1" and "Category Example 2" the list would be "category-example-1,category-example-2". This option removes the parent filter options.'
                        )
                      }
                    },
                    {
                      id: "addCategoryFilterHeading3",
                      type: "inputText-dev",
                      label: t("Heading"),
                      devices: "desktop",
                      disabled: isNotExtraCategory3Filter
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    ...toolbarParentColors<Value, Props>({
      v,
      device,
      state,
      component,
      context
    }),
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true,
      choices: []
    },
    {
      id: "itemHorizontalAlign",
      type: "toggle-dev",
      position: 80,
      disabled: isNotFeaturedView,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      disabled: isNotFeaturedView,
      options: [
        {
          id: "itemSpacing",
          label: t("Spacing"),
          type: "slider-dev",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "grid",
          type: "grid-dev",
          config: {
            separator: true
          },
          columns: [
            {
              id: "col-1",
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
              id: "col-2",
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
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      position: 110,
      disabled: !isNotFeaturedView
    }
  ];
};
