import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEkklesiaChoiches } from "visual/utils/api/common";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarParentColors } from "../toolbarParent";
import { getHelperDateFormatInputHTML } from "../utils/helpers";
import type { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = (data) => {
  const { v, device, state, component } = data;
  const config = component.getGlobalConfig();

  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const isNotFeaturedView = dvv("showFeaturedView") === "off";
  const isNotListView = dvv("showListView") === "off";
  const isNotCalendarView = dvv("showCalendarView") === "off";
  const isNotCategoryFilter = dvv("showCategoryFilter") === "off";
  const isNotExtraCategory1Filter = dvv("addCategoryFilter") === "off";
  const isNotExtraCategory2Filter = dvv("addCategoryFilter2") === "off";
  const isNotExtraCategory3Filter = dvv("addCategoryFilter3") === "off";
  const isGroupFilterDisabled = dvv("showGroupFilter") === "off";
  const isValidGroupSlug = !!dvv("groupSlug");

  return [
    {
      id: "toolbarEventLayout",
      type: "popover",
      config: {
        icon: "t2-event-layout",
        title: t("Event Layout")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          config: {
            saveTab: true
          },
          tabs: [
            {
              id: "tabColumns",
              label: t("Columns"),
              options: [
                {
                  id: "howManyFeatured",
                  label: t("Items"),
                  type: "number",
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
                  type: "number",
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
                {
                  id: "featuredViewGroup",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "showFeaturedView",
                      label: t("Featured View"),
                      type: "switch",
                      devices: "desktop"
                    },
                    {
                      id: "featuredViewOrder",
                      label: t("Order"),
                      type: "number",
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
                      type: "inputText",
                      disabled: isNotFeaturedView,
                      config: {
                        size: "medium"
                      }
                    },
                    {
                      id: "showFeaturedImages",
                      label: t("Images"),
                      type: "switch",
                      disabled: isNotFeaturedView
                    },
                    {
                      id: "showFeaturedPreview",
                      label: t("Preview"),
                      type: "switch",
                      disabled: isNotFeaturedView
                    },
                    {
                      id: "showFeaturedTitle",
                      label: t("Title"),
                      type: "switch",
                      disabled: isNotFeaturedView
                    },
                    {
                      id: "showFeaturedDate",
                      label: t("Date"),
                      type: "switch",
                      disabled: isNotFeaturedView
                    }
                  ]
                },
                {
                  id: "listViewGroup",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "showListView",
                      label: t("List View"),
                      type: "switch",
                      devices: "desktop"
                    },
                    {
                      id: "listViewOrder",
                      label: t("Order"),
                      type: "number",
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
                      type: "inputText",
                      disabled: isNotListView,
                      config: {
                        size: "medium"
                      }
                    }
                  ]
                },
                {
                  id: "calendarViewGroup",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "showCalendarView",
                      label: t("Calendar View"),
                      type: "switch",
                      devices: "desktop"
                    },
                    {
                      id: "calendarViewOrder",
                      label: t("Order"),
                      type: "number",
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
                      type: "inputText",
                      disabled: isNotCalendarView,
                      config: {
                        size: "medium"
                      }
                    }
                  ]
                },
                {
                  id: "howmanymonths",
                  type: "number",
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
                  id: "eventDetailPage",
                  type: "internalLink",
                  label: t("Item"),
                  devices: "desktop",
                  config: {
                    helper: t(
                      'URL of event detail page. If used a link to the heading and an image will be added to take the user to the event detail page. Requires the "Event Detail" widget to be placed on a page and that page url/slug placed in this field.'
                    )
                  }
                },
                {
                  id: "eventDetailPageButtonText",
                  type: "inputText",
                  devices: "desktop",
                  label: t("Button"),
                  placeholder: t("Button text..."),
                  disabled: !dvv("eventDetailPage"),
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
                  id: "groupSlug",
                  devices: "desktop",
                  label: t("Group"),
                  type: "select",
                  choices: getEkklesiaChoiches(config, {
                    key: "group"
                  })
                },
                {
                  id: "parentCategory",
                  label: t("Parent Category"),
                  type: "select",
                  devices: "desktop",
                  choices: getEkklesiaChoiches(config, {
                    key: "eventsLvl",
                    subKey: "parents"
                  }),
                  helper: {
                    content: t(
                      "Defines which level 1 category to use as a base for the layout."
                    )
                  }
                },
                {
                  id: "showGroupGroup",
                  type: "group",
                  devices: "desktop",
                  disabled: isValidGroupSlug,
                  options: [
                    {
                      id: "showGroupFilter",
                      type: "switch",
                      label: t("Group Filter"),
                      devices: "desktop"
                    },
                    {
                      id: "groupFilterHeading",
                      type: "inputText",
                      label: t("Heading"),
                      devices: "desktop",
                      disabled: isGroupFilterDisabled,
                      config: {
                        size: "medium"
                      }
                    }
                  ]
                },
                {
                  id: "categoryGroup",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "showCategoryFilter",
                      type: "switch",
                      label: t("Category"),
                      devices: "desktop"
                    },
                    {
                      id: "categoryFilterParent",
                      type: "select",
                      label: t("Parent"),
                      devices: "desktop",
                      disabled: isNotCategoryFilter,
                      choices: getEkklesiaChoiches(config, {
                        key: "eventsLvl",
                        subKey: "childs"
                      }),
                      helper: {
                        content: t(
                          "Defines which level 2 category for this specific filter. If selected will show the next level of categories as select options. If a Parent Category is selected above make sure to select a child category of that parent."
                        )
                      }
                    },
                    {
                      id: "categoryFilterList",
                      type: "inputText",
                      label: t("List"),
                      devices: "desktop",
                      disabled: isNotCategoryFilter,
                      config: {
                        size: "medium"
                      },
                      helper: {
                        content: t(
                          "This should be a comma separate list of category slugs without spaces eg. if you wanted to use the categories 'Category Example 1' and 'Category Example 2' the list would be 'category-example-1,category-example-2'. This option removes the parent filter options."
                        )
                      }
                    },
                    {
                      id: "categoryFilterHeading",
                      type: "inputText",
                      label: t("Heading"),
                      devices: "desktop",
                      disabled: isNotCategoryFilter,
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
                      label: t("Search"),
                      devices: "desktop"
                    },
                    {
                      id: "searchPlaceholder",
                      type: "inputText",
                      label: t("Placeholder"),
                      devices: "desktop",
                      disabled: dvv("showSearch") === "off",
                      config: {
                        size: "medium"
                      }
                    }
                  ]
                },
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
                        key: "eventsLvl",
                        subKey: "childs"
                      }),

                      helper: {
                        content: t(
                          "Additional category filters require this selection. Defines which level 2 category for this specific filter. If selected will show the next level of categories as select options. If a Parent Category is selected above make sure to select a child category of that parent."
                        )
                      }
                    },
                    {
                      id: "addCategoryFilterList",
                      type: "inputText",
                      label: t("List"),
                      devices: "desktop",
                      disabled: isNotExtraCategory1Filter,
                      config: {
                        size: "medium"
                      },
                      helper: {
                        content: t(
                          'This should be a comma separate list of category slugs without spaces eg. if you wanted to use the categories "Category Example 1" and "Category Example 2" the list would be "category-example-1,category-example-2". This option removes the parent filter options.'
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
                      label: t("Add Category Filter 2"),
                      devices: "desktop"
                    },
                    {
                      id: "addCategoryFilterParent2",
                      type: "select",
                      label: t("Parent"),
                      devices: "desktop",
                      disabled: isNotExtraCategory2Filter,
                      choices: getEkklesiaChoiches(config, {
                        key: "eventsLvl",
                        subKey: "childs"
                      }),
                      helper: {
                        content: t(
                          "Additional category filters require this selection. Defines which level 2 category for this specific filter. If selected will show the next level of categories as select options. If a Parent Category is selected above make sure to select a child category of that parent."
                        )
                      }
                    },
                    {
                      id: "addCategoryFilterList2",
                      type: "inputText",
                      label: t("List"),
                      devices: "desktop",
                      disabled: isNotExtraCategory2Filter,
                      config: {
                        size: "medium"
                      },
                      helper: {
                        content: t(
                          'This should be a comma separate list of category slugs without spaces eg. if you wanted to use the categories "Category Example 1" and "Category Example 2" the list would be "category-example-1,category-example-2". This option removes the parent filter options.'
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
                      label: t("Add Category Filter 3"),
                      devices: "desktop"
                    },
                    {
                      id: "addCategoryFilterParent3",
                      type: "select",
                      label: t("Parent"),
                      devices: "desktop",
                      disabled: isNotExtraCategory3Filter,
                      choices: getEkklesiaChoiches(config, {
                        key: "eventsLvl",
                        subKey: "childs"
                      }),
                      helper: {
                        content: t(
                          "Additional category filters require this selection. Defines which level 2 category for this specific filter. If selected will show the next level of categories as select options. If a Parent Category is selected above make sure to select a child category of that parent."
                        )
                      }
                    },
                    {
                      id: "addCategoryFilterList3",
                      type: "inputText",
                      label: t("List"),
                      devices: "desktop",
                      disabled: isNotExtraCategory3Filter,
                      config: {
                        size: "medium"
                      },
                      helper: {
                        content: t(
                          'This should be a comma separate list of category slugs without spaces eg. if you wanted to use the categories "Category Example 1" and "Category Example 2" the list would be "category-example-1,category-example-2". This option removes the parent filter options.'
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
            },
            {
              id: "tabMore",
              label: t("More"),
              options: [
                {
                  id: "dateFormat",
                  type: "inputText",
                  devices: "desktop",
                  helper: {
                    enabled: true,
                    content: getHelperDateFormatInputHTML()
                  },
                  label: t("Date Format")
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
      disabled: isNotFeaturedView,
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
      disabled: isNotFeaturedView,
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
      position: 110,
      disabled: !isNotFeaturedView
    }
  ];
};
