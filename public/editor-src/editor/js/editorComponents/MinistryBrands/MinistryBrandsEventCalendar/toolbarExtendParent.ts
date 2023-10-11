import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { getCollectionTypes } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { toolbarParentColors } from "../toolbarParent";
import { getEkklesiaChoiches } from "../utils/helpers";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({
  v,
  device,
  state,
  context,
  component
}) => {
  const _config = Config.getAll();
  const { apiUrl } = _config.modules?.ekklesia ?? {};

  return [
    {
      id: "toolbarEventDetail",
      type: "popover-dev",
      config: {
        icon: "t2-event-calendar",
        title: t("Event Calendar")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          devices: "desktop",
          tabs: [
            {
              id: "tabSettings",
              label: t("Settings"),
              options: [
                {
                  id: "category",
                  label: t("Category"),
                  type: "select-dev",
                  choices: getEkklesiaChoiches({ key: "event", url: apiUrl })
                },
                {
                  id: "group",
                  label: t("Group"),
                  type: "select-dev",
                  choices: getEkklesiaChoiches({ key: "groups", url: apiUrl })
                },
                {
                  id: "numberOfMonths",
                  label: t("Number of months"),
                  type: "number-dev",
                  config: {
                    min: 1,
                    max: 12,
                    spinner: true
                  }
                },
                {
                  id: "visibleMonth",
                  label: t("Visible Month"),
                  type: "number-dev",
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
                  id: "source",
                  type: "select-dev",
                  label: t("Type"),
                  devices: "desktop",
                  choices: {
                    load: () => getCollectionTypes(_config),
                    emptyLoad: {
                      title: t("There are no choices")
                    }
                  },
                  config: {
                    size: "large"
                  },
                  helper: {
                    content: t(
                      "URL of event detail page. If used will add a link to the calendar titles to take the user to the event detail page. Requires the 'Event Detail' widget to be placed on a page and that page url/slug placed in this field."
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
                }
              ]
            },
            {
              id: "tabEventCalendarDisplay",
              label: t("Display"),
              options: [
                {
                  id: "features",
                  type: "switch-dev",
                  label: t("Features"),
                  helper: {
                    content: t(
                      "If this is selected the No featured option does not apply."
                    )
                  }
                },
                {
                  id: "nonfeatures",
                  type: "switch-dev",
                  label: t("No featured"),
                  helper: {
                    content: t(
                      "If this is selected the Features option does not apply."
                    )
                  }
                },
                {
                  id: "showEventTime",
                  type: "switch-dev",
                  label: t("Event Start Time"),
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
                  type: "slider-dev",
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
    ...toolbarParentColors<Value, Props>({
      v,
      device,
      state,
      context,
      component
    }),
    { id: "horizontalAlign", type: "toggle-dev", disabled: true, choices: [] }
  ];
};
