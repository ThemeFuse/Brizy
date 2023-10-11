import { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { getCollectionTypes } from "visual/utils/api";
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
  const config = Config.getAll();

  return [
    {
      id: "toolbarSermonLayout",
      type: "popover-dev",
      config: {
        icon: "t2-sermon-layout",
        title: t("Sermon Layout")
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
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showImages",
                  label: t("Images"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showVideo",
                  label: t("Video"),
                  type: "switch-dev",
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
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showMediaLinks",
                  label: t("Media Links"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showTitle",
                  label: t("Title"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showDate",
                  label: t("Date"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showCategory",
                  label: t("Category"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showGroup",
                  label: t("Group"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showSeries",
                  label: t("Series"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showPreacher",
                  label: t("Preacher"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showPassage",
                  label: t("Passage"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showMeta",
                  label: t("Meta"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showPreview",
                  label: t("Preview"),
                  type: "switch-dev",
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
                  choices: {
                    load: () => getCollectionTypes(config),
                    emptyLoad: {
                      title: t("There are no choices")
                    }
                  },
                  config: {
                    size: "large"
                  },
                  helper: {
                    content: t(
                      'URL of sermon detail page. If used will add a link to the heading to take the user to the sermon detail page. Requires the "Sermon Detail" widget to be placed on a page and that page url/slug placed in this field.'
                    )
                  }
                },
                {
                  id: "detailPage",
                  type: "internalLink-dev",
                  label: t("Item"),
                  devices: "desktop",
                  disabled: !v.source,
                  config: {
                    postType: v.source
                  }
                },
                {
                  id: "detailPageButtonText",
                  type: "inputText-dev",
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
                  type: "group-dev",
                  devices: "desktop",
                  options: [
                    {
                      id: "showGroupFilter",
                      type: "switch-dev",
                      label: t("Group Filter")
                    },
                    {
                      id: "groupFilterHeading",
                      type: "inputText-dev",
                      label: t("Heading"),
                      disabled: v.showGroupFilter === "off"
                    }
                  ]
                },

                {
                  id: "groupCategoryFilter",
                  type: "group-dev",
                  devices: "desktop",
                  options: [
                    {
                      id: "showCategoryFilter",
                      type: "switch-dev",
                      label: t("Category Filter")
                    },
                    {
                      id: "categoryFilterHeading",
                      type: "inputText-dev",
                      label: t("Heading"),
                      disabled: v.showCategoryFilter === "off"
                    }
                  ]
                },

                {
                  id: "groupSeriesFilter",
                  type: "group-dev",
                  devices: "desktop",
                  options: [
                    {
                      id: "showSeriesFilter",
                      type: "switch-dev",
                      label: t("Series Filter")
                    },
                    {
                      id: "seriesFilterHeading",
                      type: "inputText-dev",
                      label: t("Heading"),
                      disabled: v.showSeriesFilter === "off"
                    }
                  ]
                },

                {
                  id: "groupSpeakerFilter",
                  type: "group-dev",
                  devices: "desktop",
                  options: [
                    {
                      id: "showSpeakerFilter",
                      type: "switch-dev",
                      label: t("Speaker Filter")
                    },
                    {
                      id: "speakerFilterHeading",
                      type: "inputText-dev",
                      label: t("Heading"),
                      disabled: v.showSpeakerFilter === "off"
                    }
                  ]
                },
                {
                  id: "groupSearchFilter",
                  type: "group-dev",
                  devices: "desktop",
                  options: [
                    {
                      id: "showSearchFilter",
                      type: "switch-dev",
                      label: t("Search Filter")
                    },
                    {
                      id: "searchFilterPlacehoder",
                      type: "inputText-dev",
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
      type: "toggle-dev",
      disabled: true,
      choices: []
    },
    {
      id: "itemHorizontalAlign",
      type: "toggle-dev",
      position: 80,
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
      disabled: true
    }
  ];
};
