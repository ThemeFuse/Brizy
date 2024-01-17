import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { toolbarParentColors } from "../toolbarParent";
import type { Props, Value } from "./types";

// @ts-expect-error advancedSettings is old option
export const getItems: GetItems<Value, Props> = ({
  v,
  device,
  state,
  component,
  context
}) => {
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
                  type: "number-dev",
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
                  type: "number-dev",
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
                  disabled: !v.detailPage,
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
                  id: "groupGroupFilter",
                  type: "group",
                  devices: "desktop",
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
                      disabled: v.showGroupFilter === "off"
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
                      disabled: v.showCategoryFilter === "off"
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
                      disabled: v.showSeriesFilter === "off"
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
                      disabled: v.showSpeakerFilter === "off"
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
                      disabled: v.showSearchFilter === "off"
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
      type: "legacy-advancedSettings",
      disabled: true
    }
  ];
};
