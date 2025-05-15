import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEkklesiaChoiches } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarParentColors } from "../toolbarParent";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = (data) => {
  const { v, device, component } = data;
  const config = component.getGlobalConfig();

  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  return [
    {
      id: "toolbarSermonList",
      type: "popover",
      config: {
        icon: "t2-sermon-list",
        title: t("Sermon List")
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
              id: "tabSettings",
              label: t("Settings"),
              options: [
                {
                  id: "category",
                  label: t("Category"),
                  type: "select",
                  devices: "desktop",
                  choices: getEkklesiaChoiches(config, {
                    key: "sermon"
                  })
                },
                {
                  id: "group",
                  label: t("Group"),
                  type: "select",
                  devices: "desktop",
                  choices: getEkklesiaChoiches(config, {
                    key: "groups"
                  })
                },
                {
                  id: "series",
                  label: t("Series"),
                  type: "select",
                  devices: "desktop",
                  choices: getEkklesiaChoiches(config, {
                    key: "series"
                  })
                }
              ]
            },
            {
              id: "tabColumns",
              label: t("Columns"),
              options: [
                {
                  id: "itemsNumber",
                  label: t("Items"),
                  devices: "desktop",
                  type: "number",
                  config: {
                    min: 1,
                    max: 20,
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
                },
                {
                  id: "containerHorizontalAlign",
                  label: "Container Align",
                  type: "select",
                  choices: [
                    { value: "left", title: t("Left") },
                    { value: "center", title: t("Center") },
                    { value: "right", title: t("Right") }
                  ]
                }
              ]
            },
            {
              id: "tabSermonList",
              label: t("Display"),
              options: [
                {
                  id: "showMetaIcons",
                  label: t("Meta Icons"),
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
                  id: "showVideo",
                  label: t("Video"),
                  type: "switch",
                  devices: "desktop",
                  helper: {
                    content: t(
                      "If this is selected and you would like the image to be a fallback when no video is available make sure to select 'Display Image'."
                    )
                  }
                },
                {
                  id: "showImages",
                  label: t("Images"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showAudio",
                  label: t("Audio"),
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
                  id: "showPreacher",
                  label: t("Preacher"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showPassages",
                  label: t("Passages"),
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
                  id: "showMedia",
                  label: t("Media"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showPreview",
                  label: t("Preview"),
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
                  id: "features",
                  label: t("Featured"),
                  type: "switch",
                  devices: "desktop",
                  helper: {
                    content: t(
                      "If this is selected the Non featured Only option does not apply."
                    )
                  }
                },
                {
                  id: "nonfeatures",
                  label: t("Non Featured"),
                  type: "switch",
                  devices: "desktop",
                  helper: {
                    content: t(
                      "If this is selected the Featured Only option does not apply."
                    )
                  }
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
                      "URL of sermon detail page. If used will add a link to the heading to take the user to the sermon detail page. Requires the 'Sermon Detail' widget to be placed on a page and that page url/slug placed in this field ."
                    )
                  }
                },
                {
                  id: "detailPageButton",
                  devices: "desktop",
                  type: "inputText",
                  placeholder: t("Button text..."),
                  label: t("Button"),
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
            }
          ]
        }
      ]
    },
    ...toolbarParentColors<Value, Props>(data),
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
      id: "horizontalAlign",
      type: "toggle",
      disabled: true,
      choices: []
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      disabled: true
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
    }
  ];
};
