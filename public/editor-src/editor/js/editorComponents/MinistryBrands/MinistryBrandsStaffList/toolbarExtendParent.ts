import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEkklesiaChoiches } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarParentColors } from "../toolbarParent";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = (props) => {
  const { v, device, component } = props;
  const config = component.getGlobalConfig();

  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  return [
    {
      id: "toolbarStaffList",
      type: "popover",
      config: {
        icon: "t2-staff-list",
        title: t("Staff List")
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
                  label: t("Group"),
                  type: "select",
                  devices: "desktop",
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
              id: "tabStaffList",
              label: t("Display"),
              options: [
                {
                  id: "showMetaHeadings",
                  type: "switch",
                  label: t("Meta Headings"),
                  devices: "desktop"
                },
                {
                  id: "showMetaIcons",
                  label: t("Meta Icons"),
                  type: "switch",
                  devices: "desktop",
                  helper: {
                    content: t("Show icons when Meta Headings are enabled")
                  }
                },
                {
                  id: "showTitle",
                  label: t("Name"),
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
                  id: "showGroups",
                  label: t("Groups"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showPosition",
                  label: t("Position"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showPhoneWork",
                  label: t("Phone Work"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showPhoneCell",
                  label: t("Phone Cell"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showEmail",
                  label: t("Email"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showFullEmail",
                  type: "switch",
                  devices: "desktop",
                  label: t("Full Email"),
                  helper: {
                    content: t("Show full email address instead of a mail icon")
                  }
                },
                {
                  id: "showFacebook",
                  label: t("Facebook"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showTwitter",
                  label: t("Twitter(X)"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showWebsite",
                  label: t("Website"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showRss",
                  type: "switch",
                  label: t("RSS Feed"),
                  devices: "desktop"
                },
                {
                  id: "showInstagram",
                  label: t("Instagram"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showPagination",
                  type: "switch",
                  devices: "desktop",
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
                      "URL of staff list page. If used will add a link to the heading to take the user to the staff list page. Requires the 'Staff List' widget to be placed on a page and that page url/slug placed in this field ."
                    )
                  }
                },
                {
                  id: "detailPageButton",
                  devices: "desktop",
                  type: "inputText",
                  placeholder: t("Read More"),
                  label: t("Detail Link"),
                  disabled: !dvv("detailPage"),
                  config: {
                    size: "medium"
                  },
                  helper: {
                    content: t(
                      "Link will display if text is entered and a detail page selected."
                    )
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    ...toolbarParentColors<Value, Props>(props),
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
