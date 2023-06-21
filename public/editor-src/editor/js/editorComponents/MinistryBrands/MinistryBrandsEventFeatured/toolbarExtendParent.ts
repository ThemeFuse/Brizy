import { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarParentColors } from "../toolbarParent";
import { getEkklesiaChoiches } from "../utils/helpers";
import { Props, Value } from "./types";

// @ts-expect-error advancedSettings is old option
export const getItems: GetItems<Value, Props> = ({
  v,
  state,
  component,
  context,
  device
}) => {
  const _config = Config.getAll();
  const { apiUrl } = _config.modules?.ekklesia ?? {};
  const { getSourceChoices } = _config.api?.sourceTypes ?? {};

  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const showLatestEvents = dvv("showLatestEvents") === "on";
  return [
    {
      id: "toolbarEventFeatured",
      type: "popover-dev",
      config: {
        icon: "t2-event-featured",
        title: t("Event Featured")
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
                  id: "showLatestEvents",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Show Latest"),
                  helper: {
                    content: t(
                      "This option automatically shows the latest event and overrides the 'Recent Events' and 'Event Slug' options."
                    )
                  }
                },
                {
                  id: "category",
                  devices: "desktop",
                  label: t("Category"),
                  type: "select-dev",
                  disabled: !showLatestEvents,
                  choices: getEkklesiaChoiches({ key: "event", url: apiUrl }),
                  helper: {
                    content: t("This option only applies to 'Show Latest'.")
                  }
                },
                {
                  id: "group",
                  devices: "desktop",
                  label: t("Group"),
                  type: "select-dev",
                  disabled: !showLatestEvents,
                  choices: getEkklesiaChoiches({ key: "groups", url: apiUrl }),
                  helper: {
                    content: t("This option only applies to 'Show Latest'.")
                  }
                },
                {
                  id: "recentEvents",
                  devices: "desktop",
                  label: t("Recent Events"),
                  type: "select-dev",
                  disabled: showLatestEvents || dvv("eventSlug") !== "",
                  choices: getEkklesiaChoiches({ key: "events", url: apiUrl }),
                  helper: {
                    content: t(
                      'Select a recent event. Use only if you are not using "Event Slug" below and "Show Latest" is set to "Off".'
                    )
                  }
                },
                {
                  id: "features",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Features"),
                  disabled: !showLatestEvents || dvv("nonfeatures") === "on",
                  helper: {
                    content: t(
                      "This option only applies to 'Show Latest' and if this is selected the 'No featured' option does not apply."
                    )
                  }
                },
                {
                  id: "nonfeatures",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("No featured"),
                  disabled: !showLatestEvents || dvv("features") === "on",
                  helper: {
                    content: t(
                      "This option only applies to 'Show Latest' and if this is selected the 'Featured' option does not apply."
                    )
                  }
                },
                {
                  id: "eventSlug",
                  type: "inputText-dev",
                  devices: "desktop",
                  placeholder: t("Slug..."),
                  disabled: showLatestEvents,
                  label: t("Slug"),
                  helper: {
                    content: t(
                      'Slug of event (my-event-name). Use only if you are not selecting from the "Recent Events" above and "Show Latest" is set to "Off".'
                    )
                  }
                }
              ]
            },
            {
              id: "tabEventFeatured",
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
                },
                {
                  id: "showPreview",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Preview")
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
                  choices: getSourceChoices?.() ?? [],
                  config: {
                    size: "large"
                  },
                  helper: {
                    content: t(
                      'URL of event detail page. If used a link to the heading and an image will be added to take the user to the event detail page. Requires the "Event Detail" widget to be placed on a page and that page url/slug placed in this field .'
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
                },
                {
                  id: "detailPageButtonText",
                  type: "inputText-dev",
                  devices: "desktop",
                  placeholder: t("Button Text..."),
                  label: t("Button"),
                  disabled: !dvv("detailPage"),
                  helper: {
                    content: t(
                      "Button will display if text is entered and a detail page selected."
                    )
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
