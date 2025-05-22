import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEkklesiaChoiches } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarParentColors } from "../toolbarParent";
import { getHelperDateFormatInputHTML } from "../utils/helpers";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = (data) => {
  const { v, device, state, component } = data;
  const config = component.getGlobalConfig();

  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  return [
    {
      id: "toolbarEventList",
      type: "popover",
      config: {
        icon: "t2-event-list",
        title: t("Event List")
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
                  devices: "desktop",
                  label: t("Category"),
                  type: "select",
                  choices: getEkklesiaChoiches(config, {
                    key: "event"
                  })
                },
                {
                  id: "group",
                  devices: "desktop",
                  label: t("Group"),
                  type: "select",
                  choices: getEkklesiaChoiches(config, {
                    key: "groups"
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
                  type: "number",
                  devices: "desktop",
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
              id: "tabEventList",
              label: t("Display"),
              options: [
                {
                  id: "showMetaIcons",
                  label: t("Meta Icons"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showImage",
                  label: t("Image"),
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
                  id: "showLocation",
                  label: t("Location"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showRegistration",
                  label: t("Registration"),
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
                  type: "switch",
                  label: t("Featured"),
                  devices: "desktop",
                  helper: {
                    content: t(
                      "If this is selected the Non featured Only option does not apply."
                    )
                  }
                },
                {
                  id: "nonfeatures",
                  type: "switch",
                  label: t("Non Featured"),
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
                      'URL of event detail page. If used a link to the heading and an image will be added to take the user to the event detail page. Requires the "Event Detail" widget to be placed on a page and that page url/slug placed in this field .'
                    )
                  }
                },
                {
                  id: "detailPageButtonText",
                  type: "inputText",
                  devices: "desktop",
                  label: t("Button"),
                  placeholder: t("Button text..."),
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
