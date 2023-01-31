import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { toolbarParentColors } from "../toolbarParent";
import { getChoicesById, getOption } from "../utils/helpers";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({
  v,
  device,
  state,
  context,
  component
}) => {
  const ekklesia = Config.getAll()?.modules?.ekklesia;
  const categories = getOption(ekklesia?.terms?.event);
  const group = getOption(ekklesia?.groups);
  const detail = getChoicesById(ekklesia?.pages);

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
                  choices: categories
                },
                {
                  id: "group",
                  label: t("Group"),
                  type: "select-dev",
                  choices: group
                },
                {
                  id: "detailPage",
                  label: t("Detail Page"),
                  type: "select-dev",
                  choices: detail,
                  helper: {
                    content: t(
                      "URL of event detail page. If used will add a link to the calendar titles to take the user to the event detail page. Requires the 'Event Detail' widget to be placed on a page and that page url/slug placed in this field."
                    )
                  }
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
                }
              ]
            },
            {
              id: "tabEventDetail",
              label: t("Display"),
              options: [
                {
                  id: "features",
                  type: "switch-dev",
                  label: t("Features"),
                  helper: {
                    content: t(
                      "If this is selected the Non Features option does not apply."
                    )
                  }
                },
                {
                  id: "nonfeatures",
                  type: "switch-dev",
                  label: t("Non features"),
                  helper: {
                    content: t(
                      "If this is selected the Features option does not apply."
                    )
                  }
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
