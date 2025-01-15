import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEkklesiaChoiches } from "visual/utils/api/common";
import { t } from "visual/utils/i18n";
import { toolbarParentColors } from "../toolbarParent";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = (data) => {
  const config = data.component.getGlobalConfig();

  return [
    {
      id: "toolbarEventDetail",
      type: "popover",
      config: {
        icon: "t2-event-calendar",
        title: t("Event Calendar")
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
                  id: "category",
                  label: t("Category"),
                  type: "select",
                  choices: getEkklesiaChoiches(config, {
                    key: "event"
                  })
                },
                {
                  id: "group",
                  label: t("Group"),
                  type: "select",
                  choices: getEkklesiaChoiches(config, {
                    key: "groups"
                  })
                },
                {
                  id: "numberOfMonths",
                  label: t("Number of months"),
                  type: "number",
                  config: {
                    min: 1,
                    max: 12,
                    spinner: true
                  }
                },
                {
                  id: "visibleMonth",
                  label: t("Visible Month"),
                  type: "number",
                  config: {
                    min: 1,
                    max: 12,
                    spinner: true
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
                      "URL of event detail page. If used will add a link to the calendar titles to take the user to the event detail page. Requires the 'Event Detail' widget to be placed on a page and that page url/slug placed in this field."
                    )
                  }
                }
              ]
            },
            {
              id: "tabEventCalendarDisplay",
              label: t("Display"),
              options: [
                {
                  id: "features",
                  type: "switch",
                  label: t("Featured"),
                  helper: {
                    content: t(
                      "If this is selected the No featured option does not apply."
                    )
                  }
                },
                {
                  id: "nonfeatures",
                  type: "switch",
                  label: t("Non Featured"),
                  helper: {
                    content: t(
                      "If this is selected the Features option does not apply."
                    )
                  }
                },
                {
                  id: "showEventTime",
                  type: "switch",
                  label: t("Event Start Time"),
                  devices: "desktop"
                },
                {
                  id: "showSubscribeToCalendarButton",
                  type: "switch",
                  label: t("Subscribe to Calendar"),
                  devices: "desktop"
                }
              ]
            },
            {
              id: "tabEventSpacing",
              label: t("Between"),
              options: [
                {
                  id: "borderSpacing",
                  label: t("Spacing"),
                  type: "slider",
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    ...toolbarParentColors<Value, Props>(data),
    { id: "horizontalAlign", type: "toggle", disabled: true, choices: [] }
  ];
};
