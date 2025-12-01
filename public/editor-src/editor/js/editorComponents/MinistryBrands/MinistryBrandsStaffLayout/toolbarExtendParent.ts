import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEkklesiaChoiches } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarParentColors } from "../toolbarParent";
import type { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = (props) => {
  const { v, device, state, component } = props;

  const config = component.getGlobalConfig();
  const dvv = (key: string): unknown =>
    defaultValueValue({ key, v, device, state });

  return [
    {
      id: "toolbarStaffLayout",
      type: "popover",
      config: {
        icon: "nc-users-rectangle",
        title: t("Staff Layout")
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
              id: "tabStaffLayoutDisplay",
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
                  id: "showImages",
                  type: "switch",
                  devices: "desktop",
                  label: t("Images")
                },
                {
                  id: "showTitle",
                  type: "switch",
                  devices: "desktop",
                  label: t("Name")
                },
                {
                  id: "showPosition",
                  type: "switch",
                  devices: "desktop",
                  label: t("Position")
                },
                {
                  id: "showGroups",
                  type: "switch",
                  devices: "desktop",
                  label: t("Groups")
                },
                {
                  id: "showPhoneWork",
                  type: "switch",
                  devices: "desktop",
                  label: t("Phone Work")
                },
                {
                  id: "showPhoneCell",
                  type: "switch",
                  devices: "desktop",
                  label: t("Phone Cell")
                },
                {
                  id: "showEmail",
                  type: "switch",
                  devices: "desktop",
                  label: t("Email")
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
                  type: "switch",
                  devices: "desktop",
                  label: t("Facebook")
                },
                {
                  id: "showTwitter",
                  type: "switch",
                  devices: "desktop",
                  label: t("Twitter(X)")
                },
                {
                  id: "showWebsite",
                  type: "switch",
                  devices: "desktop",
                  label: t("Website")
                },
                {
                  id: "showRss",
                  type: "switch",
                  label: t("RSS Feed"),
                  devices: "desktop"
                },
                {
                  id: "showInstagram",
                  type: "switch",
                  devices: "desktop",
                  label: t("Instagram")
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
                      'URL of staff detail page. If used will add a link to the heading to take the user to the staff detail page. Requires the "Staff Detail" widget to be placed on a page and that page url/slug placed in this field.'
                    )
                  }
                },
                {
                  id: "detailPageButtonText",
                  type: "inputText",
                  label: t("Detail Link"),
                  placeholder: t("Read More"),
                  devices: "desktop",
                  disabled: !v.detailPage,
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
            },
            {
              id: "tabFilterSettings",
              label: t("Filter"),
              options: [
                {
                  id: "series",
                  label: t("Series"),
                  type: "select",
                  devices: "desktop",
                  choices: getEkklesiaChoiches(config, {
                    key: "groupSeries"
                  })
                },
                {
                  id: "showGroup",
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
                      disabled: dvv("showGroupFilter") === "off",
                      devices: "desktop",
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
                }
              ]
            }
          ]
        }
      ]
    },
    ...toolbarParentColors(props),
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
