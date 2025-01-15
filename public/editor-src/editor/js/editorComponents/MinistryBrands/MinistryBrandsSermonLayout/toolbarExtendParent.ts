import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEkklesiaChoiches } from "visual/utils/api/common";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarParentColors } from "../toolbarParent";
import type { Props, Value } from "./types";
import { getAdditionalColorOptions } from "./utils/toolbarExtensions";

export const getItems: GetItems<Value, Props> = (data) => {
  const { v, device, component } = data;
  const config = component.getGlobalConfig();
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const isDisabledFilterCategory = dvv("showCategoryFilter") === "off";
  const isGroupFilterDisabled = dvv("showGroupFilter") === "off";
  const isValidGroupSlug = !!dvv("groupSlug");

  const isDisabledSearchFilter = dvv("showSearchFilter") === "off";

  return [
    {
      id: "toolbarSermonLayout",
      type: "popover",
      config: {
        icon: "t2-sermon-layout",
        title: t("Sermon Layout")
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
                  id: "howmany",
                  type: "number",
                  label: t("Items"),
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
              id: "tabSermonLayout",
              label: t("Display"),
              options: [
                {
                  id: "showMetaIcons",
                  label: t("Meta Icons"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showPagination",
                  label: t("Pagination"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showImages",
                  label: t("Images"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showVideo",
                  label: t("Video"),
                  type: "switch",
                  devices: "desktop",
                  helper: {
                    content: t(
                      'If this is selected and you would like the image to be a fallback when no video is available make sure to select "Images".'
                    )
                  }
                },
                {
                  id: "showAudio",
                  label: t("Audio"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showMediaLinks",
                  label: t("Media Links"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showTitle",
                  label: t("Title"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showDate",
                  label: t("Date"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showCategory",
                  label: t("Category"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showGroup",
                  label: t("Group"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showSeries",
                  label: t("Series"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showPreacher",
                  label: t("Preacher"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showPassage",
                  label: t("Passage"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showMeta",
                  label: t("Meta"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showPreview",
                  label: t("Preview"),
                  type: "switch",
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
                    size: "medium",
                    helper: t(
                      'URL of sermon detail page. If used will add a link to the heading to take the user to the sermon detail page. Requires the "Sermon Detail" widget to be placed on a page and that page url/slug placed in this field.'
                    )
                  }
                },
                {
                  id: "detailPageButtonText",
                  type: "inputText",
                  label: t("Button Text"),
                  devices: "desktop",
                  placeholder: t("Button Text..."),
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
              id: "tabSermonLayoutFilter",
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
                      key: "sermon"
                    },
                    {
                      display: "list",
                      groupby: "group",
                      order: "title",
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
                    key: "sermonsLvl",
                    subKey: "parents"
                  }),
                  helper: {
                    content: t(
                      "Defines which level 1 category to use as a base for the layout."
                    )
                  }
                },
                {
                  id: "groupGroupFilter",
                  type: "group",
                  devices: "desktop",
                  disabled: isValidGroupSlug,
                  options: [
                    {
                      id: "showGroupFilter",
                      type: "switch",
                      label: t("Group Filter")
                    },
                    {
                      id: "groupFilterHeading",
                      type: "inputText",
                      label: t("Heading"),
                      disabled: isGroupFilterDisabled,
                      config: {
                        size: "medium"
                      }
                    }
                  ]
                },
                {
                  id: "groupCategoryFilter",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "showCategoryFilter",
                      type: "switch",
                      label: t("Category Filter")
                    },
                    {
                      id: "categoryFilterHeading",
                      type: "inputText",
                      label: t("Heading"),
                      disabled: isDisabledFilterCategory
                    },
                    {
                      id: "defaultCategory",
                      devices: "desktop",
                      label: t("Default Category"),
                      type: "select",
                      disabled: isDisabledFilterCategory,
                      choices: getEkklesiaChoiches(config, { key: "sermon" })
                    }
                  ]
                },
                {
                  id: "groupSeriesFilter",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "showSeriesFilter",
                      type: "switch",
                      label: t("Series Filter")
                    },
                    {
                      id: "seriesFilterHeading",
                      type: "inputText",
                      label: t("Heading"),
                      disabled: dvv("showSeriesFilter") === "off",
                      config: {
                        size: "medium"
                      }
                    }
                  ]
                },
                {
                  id: "groupSpeakerFilter",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "showSpeakerFilter",
                      type: "switch",
                      label: t("Speaker Filter")
                    },
                    {
                      id: "speakerFilterHeading",
                      type: "inputText",
                      label: t("Heading"),
                      disabled: dvv("showSpeakerFilter") === "off",
                      config: {
                        size: "medium"
                      }
                    }
                  ]
                },
                {
                  id: "groupSearchFilter",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "showSearchFilter",
                      type: "switch",
                      label: t("Search Filter")
                    },
                    {
                      id: "searchFilterPlacehoder",
                      type: "inputText",
                      label: t("Placeholder"),
                      disabled: isDisabledSearchFilter,
                      config: {
                        size: "medium"
                      }
                    },
                    {
                      id: "searchValue",
                      type: "inputText",
                      label: t("Value"),
                      devices: "desktop",
                      placeholder: t("Search Text..."),
                      disabled: isDisabledSearchFilter,
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
    ...toolbarParentColors<Value, Props>(data, getAdditionalColorOptions()),
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
