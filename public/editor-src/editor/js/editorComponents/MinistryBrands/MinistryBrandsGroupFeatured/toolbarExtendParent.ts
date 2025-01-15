import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEkklesiaChoiches } from "visual/utils/api/common";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarParentColors } from "../toolbarParent";
import { getHelperDateFormatInputHTML } from "../utils/helpers";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = (data) => {
  const { v, device, component } = data;
  const config = component.getGlobalConfig();

  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const groupLatestActive = dvv("groupLatest") === "on";

  return [
    {
      id: "toolbarGroupFeatured",
      type: "popover",
      config: {
        icon: "t2-group-featured",
        title: t("Group Featured")
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
                  id: "groupLatest",
                  type: "switch",
                  devices: "desktop",
                  label: t("Show Latest"),
                  helper: {
                    content: t(
                      "This option automatically shows the latest group and overrides the 'Recent Groups' and 'Group Slug' options."
                    )
                  }
                },
                {
                  id: "category",
                  devices: "desktop",
                  label: t("Category"),
                  type: "select",
                  disabled: !groupLatestActive,
                  choices: getEkklesiaChoiches(config, {
                    key: "smallgroup"
                  }),
                  helper: {
                    content: t("This option only applies to 'Show Latest'.")
                  }
                },
                {
                  id: "group",
                  devices: "desktop",
                  label: t("Group"),
                  type: "select",
                  disabled: !groupLatestActive,
                  choices: getEkklesiaChoiches(config, {
                    key: "groups"
                  }),
                  helper: {
                    content: t("This option only applies to 'Show Latest'.")
                  }
                },
                {
                  id: "groupRecentList",
                  devices: "desktop",
                  label: t("Recent Groups"),
                  type: "select",
                  disabled: groupLatestActive || dvv("groupSlug") !== "",
                  choices: getEkklesiaChoiches(config, {
                    key: "smallgroups"
                  }),
                  helper: {
                    content: t(
                      "Select a recent group. Use only if you are not using 'Group Slug' below and 'Show Latest' is set to 'Off'."
                    )
                  }
                }
              ]
            },
            {
              id: "tabGroupFeatured",
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
                  type: "switch",
                  label: t("Image"),
                  devices: "desktop"
                },
                {
                  id: "showTitle",
                  label: t("Title"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showCategory",
                  type: "switch",
                  label: t("Category"),
                  devices: "desktop"
                },
                {
                  id: "showGroup",
                  type: "switch",
                  label: t("Group"),
                  devices: "desktop"
                },
                {
                  id: "showDay",
                  type: "switch",
                  label: t("Day"),
                  devices: "desktop"
                },
                {
                  id: "showTimes",
                  type: "switch",
                  label: t("Times"),
                  devices: "desktop"
                },
                {
                  id: "showStatus",
                  type: "switch",
                  label: t("Status"),
                  devices: "desktop"
                },
                {
                  id: "showChildcare",
                  type: "switch",
                  label: t("Childcare"),
                  devices: "desktop"
                },
                {
                  id: "showResourceLink",
                  type: "switch",
                  label: t("Resource Link"),
                  devices: "desktop"
                },
                {
                  id: "showPreview",
                  type: "switch",
                  label: t("Preview"),
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
                      "URL of group detail page. If used will add a link to the heading to take the user to the group detail page. Requires the 'Group Detail' widget to be placed on a page and that page url/slug placed in this field ."
                    )
                  }
                },
                {
                  id: "detailPageButtonText",
                  type: "inputText",
                  devices: "desktop",
                  label: t("Button"),
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
                },
                {
                  id: "groupSlug",
                  type: "inputText",
                  devices: "desktop",
                  label: t("Slug"),
                  disabled: groupLatestActive || dvv("groupRecentList") !== "",
                  placeholder: t("Slug..."),
                  config: {
                    size: "medium"
                  },
                  helper: {
                    content: t(
                      "Slug of group. Use only if you are not selecting from the 'Recent Groups' above and 'Show Latest' is set to 'Off'."
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
