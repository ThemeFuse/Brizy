import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEkklesiaChoiches } from "visual/utils/api/common";
import { t } from "visual/utils/i18n";
import { toolbarParentColors } from "../toolbarParent";
import { getHelperDateFormatInputHTML } from "../utils/helpers";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = (data) => {
  const config = data.component.getGlobalConfig();

  return [
    {
      id: "toolbarGroupDetail",
      type: "popover",
      config: {
        icon: "t2-group-detail",
        title: t("Group Detail")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          config: {
            saveTab: true
          },
          devices: "desktop",
          tabs: [
            {
              id: "tabSettings",
              label: t("Settings"),
              options: [
                {
                  id: "groupsRecent",
                  label: t("Recent Groups"),
                  type: "select",
                  choices: getEkklesiaChoiches(config, {
                    key: "smallgroups"
                  })
                }
              ]
            },
            {
              id: "tabGroupDetail",
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
                  label: t("Image")
                },
                {
                  id: "showTitle",
                  type: "switch",
                  label: t("Title")
                },
                {
                  id: "showCategory",
                  type: "switch",
                  label: t("Category")
                },
                {
                  id: "showGroup",
                  type: "switch",
                  label: t("Group")
                },
                {
                  id: "showMetaHeadings",
                  type: "switch",
                  label: t("Meta Headings")
                },
                {
                  id: "showDay",
                  type: "switch",
                  label: t("Day")
                },
                {
                  id: "showTimes",
                  type: "switch",
                  label: t("Times")
                },
                {
                  id: "showStatus",
                  type: "switch",
                  label: t("Status")
                },
                {
                  id: "showChildcare",
                  type: "switch",
                  label: t("Childcare")
                },
                {
                  id: "showResourceLink",
                  type: "switch",
                  label: t("Resource Link")
                },
                {
                  id: "showContent",
                  type: "switch",
                  label: t("Content")
                },
                {
                  id: "showPreviousPage",
                  type: "switch",
                  label: t("Previous Page")
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
