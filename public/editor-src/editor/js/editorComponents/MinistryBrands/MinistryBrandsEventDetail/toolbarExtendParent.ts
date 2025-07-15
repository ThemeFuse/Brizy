import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEkklesiaChoiches } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { toolbarParentColors } from "../toolbarParent";
import { getHelperDateFormatInputHTML } from "../utils/helpers";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = (data) => {
  const config = data.component.getGlobalConfig();

  return [
    {
      id: "toolbarEventDetail",
      type: "popover",
      config: {
        icon: "t2-event-detail",
        title: t("Event Detail")
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
                  id: "recentEvents",
                  devices: "desktop",
                  label: t("Recent Events"),
                  type: "select",
                  choices: getEkklesiaChoiches(config, {
                    key: "events"
                  }),
                  helper: {
                    content: t(
                      "Select a recent event as an example to style/setup. Since this is the events detail landing page this event will be replaced with the linked event."
                    )
                  }
                }
              ]
            },
            {
              id: "tabEventDetail",
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
                  devices: "desktop",
                  label: t("Image")
                },
                {
                  id: "showTitle",
                  type: "switch",
                  devices: "desktop",
                  label: t("Title")
                },
                {
                  id: "showDate",
                  type: "switch",
                  devices: "desktop",
                  label: t("Date")
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
                  id: "showMetaHeadings",
                  type: "switch",
                  devices: "desktop",
                  label: t("Meta Headings")
                },
                {
                  id: "showLocation",
                  type: "switch",
                  devices: "desktop",
                  label: t("Location")
                },
                {
                  id: "showRoom",
                  type: "switch",
                  devices: "desktop",
                  label: t("Room")
                },
                {
                  id: "showCoordinator",
                  type: "switch",
                  devices: "desktop",
                  label: t("Coordinator")
                },
                {
                  id: "showCoordinatorEmail",
                  type: "switch",
                  devices: "desktop",
                  label: t("Coordinator Email")
                },
                {
                  id: "showCoordinatorPhone",
                  type: "switch",
                  devices: "desktop",
                  label: t("Coordinator Phone")
                },
                {
                  id: "showCost",
                  type: "switch",
                  devices: "desktop",
                  label: t("Cost")
                },
                {
                  id: "showWebsite",
                  type: "switch",
                  devices: "desktop",
                  label: t("Website")
                },
                {
                  id: "showRegistration",
                  type: "switch",
                  devices: "desktop",
                  label: t("Registration")
                },
                {
                  id: "showDescription",
                  type: "switch",
                  devices: "desktop",
                  label: t("Description")
                },
                {
                  id: "showSubscribeToEvent",
                  type: "switch",
                  devices: "desktop",
                  label: t("Subscribe to Event")
                },
                {
                  id: "showPreviousPage",
                  type: "switch",
                  devices: "desktop",
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
