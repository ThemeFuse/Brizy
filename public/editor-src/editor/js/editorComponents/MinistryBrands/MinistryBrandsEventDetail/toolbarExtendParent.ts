import { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { toolbarParentColors } from "../toolbarParent";
import { getOption } from "../utils/helpers";
import { Props, Value } from "./types";

// @ts-expect-error advancedSettings is old option
export const getItems: GetItems<Value, Props> = ({
  v,
  device,
  state,
  component,
  context
}) => {
  const ekklesia = Config.getAll()?.modules?.ekklesia;
  const recentEvents = getOption(ekklesia?.events);
  return [
    {
      id: "toolbarEventDetail",
      type: "popover-dev",
      config: {
        icon: "t2-event-detail",
        title: t("Event Detail")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabSettings",
              label: t("Settings"),
              options: [
                {
                  id: "recentEvents",
                  devices: "desktop",
                  label: t("Recent Events"),
                  type: "select-dev",
                  choices: recentEvents,
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
                  id: "showImage",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Image")
                },
                {
                  id: "showTitle",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Title")
                },
                {
                  id: "showDate",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Date")
                },
                {
                  id: "showCategory",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Category")
                },
                {
                  id: "showGroup",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Group")
                },
                {
                  id: "showMetaHeadings",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Meta Headings")
                },
                {
                  id: "showLocation",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Location")
                },
                {
                  id: "showRoom",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Room")
                },
                {
                  id: "showCoordinator",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Coordinator")
                },
                {
                  id: "showCoordinatorEmail",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Coordinator Email")
                },
                {
                  id: "showCoordinatorPhone",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Coordinator Phone")
                },
                {
                  id: "showCost",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Cost")
                },
                {
                  id: "showWebsite",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Website")
                },
                {
                  id: "showRegistration",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Registration")
                },
                {
                  id: "showDescription",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Description")
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
      id: "horizontalAlign",
      type: "toggle-dev",
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
      type: "toggle-dev",
      position: 80,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    }
  ];
};
