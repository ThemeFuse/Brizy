import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEkklesiaChoiches } from "visual/utils/api/common";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarParentColors } from "../toolbarParent";
import { getHelperDateFormatInputHTML } from "../utils/helpers";
import type { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = (data) => {
  const { v, device, component } = data;
  const config = component.getGlobalConfig();

  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const isNotCategoryFilter = dvv("showCategoryFilter") === "off";
  const isNotExtraCategory1Filter = dvv("addCategoryFilter") === "off";
  const isNotExtraCategory2Filter = dvv("addCategoryFilter2") === "off";
  const isNotExtraCategory3Filter = dvv("addCategoryFilter3") === "off";
  const isGroupFilterDisabled = dvv("showGroupFilter") === "off";
  const isValidGroupSlug = !!dvv("groupSlug");

  return [
    {
      id: "toolbarGroupLayout",
      type: "popover",
      config: {
        icon: "t2-group-layout",
        title: t("Group Layout")
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
                  id: "columnNumber",
                  label: t("Columns"),
                  type: "number",
                  config: {
                    min: 1,
                    max: 6,
                    spinner: true
                  }
                },
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
                }
              ]
            },
            {
              id: "tabGroupLayoutDisplay",
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
                  devices: "desktop",
                  label: t("Images")
                },
                {
                  id: "showMeetingDay",
                  type: "switch",
                  devices: "desktop",
                  label: t("Meeting Day")
                },
                {
                  id: "showMeetingTime",
                  type: "switch",
                  devices: "desktop",
                  label: t("Meeting Time")
                },
                {
                  id: "showCategory",
                  type: "switch",
                  devices: "desktop",
                  label: t("Category")
                },
                {
                  id: "showGroup",
                  type: "switch",
                  devices: "desktop",
                  label: t("Group")
                },
                {
                  id: "showStatus",
                  type: "switch",
                  devices: "desktop",
                  label: t("Status")
                },
                {
                  id: "showChildcare",
                  type: "switch",
                  devices: "desktop",
                  label: t("Childcare")
                },
                {
                  id: "showResourceLink",
                  type: "switch",
                  devices: "desktop",
                  label: t("Resource Link")
                },
                {
                  id: "showPreview",
                  type: "switch",
                  devices: "desktop",
                  label: t("Preview")
                },
                {
                  id: "showPagination",
                  type: "switch",
                  label: t("Pagination"),
                  devices: "desktop"
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
                      'URL of group detail page. If used will add a link to the heading to take the user to the group detail page. Requires the "Group Detail" widget to be placed on a page and that page url/slug placed in this field.'
                    )
                  }
                },
                {
                  id: "detailButtonText",
                  type: "inputText",
                  label: t("Detail Button"),
                  placeholder: t("Button name..."),
                  devices: "desktop",
                  disabled: !dvv("detailPage"),
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
                  choices: getEkklesiaChoiches(
                    config,
                    {
                      key: "smallgroup"
                    },
                    {
                      display: "list",
                      groupby: "group",
                      show: "group_show"
                    }
                  )
                },
                {
                  id: "parentCategory",
                  label: t("Parent Category"),
                  type: "select",
                  devices: "desktop",
                  choices: getEkklesiaChoiches(config, {
                    key: "smallgroupsLvl",
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
                        key: "smallgroupsLvl",
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
                        key: "smallgroupsLvl",
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
                        key: "smallgroupsLvl",
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
