import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./types";
import { getDynamicContentOption } from "visual/utils/options";
import { widthCSS } from "./css";

export const getItems: GetItems<Value> = ({ v, device, context }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

  const isScriptLoad = dvv("scriptLoadDisabled") === "on";
  const isPlaceholderSpinner = dvv("placeholderSpinnerDisabled") === "on";

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "t2-instagram-feed",
        title: t("Instagram Feed")
      },
      position: 10,
      devices: "desktop",
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Content"),
              options: [
                {
                  id: "embedUrl",
                  label: t("Url"),
                  type: "inputText",
                  placeholder: "http://",
                  population: richTextDC
                },
                {
                  id: "placeholderSpinner",
                  label: t("Placeholder spinner"),
                  type: "inputText",
                  placeholder: t("Loading..."),
                  disabled: isPlaceholderSpinner,
                  population: richTextDC,
                  helper: {
                    content: t(
                      "Customizes the spinner displayed while the content is loading"
                    )
                  }
                },
                {
                  id: "linkText",
                  label: t("Link text"),
                  type: "inputText",
                  placeholder: t("View on Instagram"),
                  population: richTextDC,
                  helper: {
                    content: t(
                      "The text displayed as a link to view the content."
                    )
                  }
                }
              ]
            },
            {
              id: "currentShortcodeSwitchTab",
              label: t("Display"),
              options: [
                {
                  id: "captioned",
                  label: t("Captioned"),
                  type: "switch",
                  disabled: isScriptLoad,
                  helper: {
                    content: t(
                      "Displays captions from the Instagram Post. If set to false, it provides a cleaner view of the embedded content without additional text."
                    )
                  }
                },
                {
                  id: "scriptLoadDisabled",
                  label: t("Script load"),
                  type: "switch",
                  helper: {
                    content: t(
                      "Prevents the automatic loading of the script that is required for embedding content."
                    )
                  }
                },
                {
                  id: "placeholderDisabled",
                  label: t("Placeholder"),
                  type: "switch",
                  helper: {
                    content: t("Disables the placeholder completely.")
                  }
                },
                {
                  id: "placeholderSpinnerDisabled",
                  label: t("Placeholder spinner"),
                  type: "switch",
                  helper: {
                    content: t(
                      "Disables the default loading spinner that appears while the content is loading."
                    )
                  }
                }
              ]
            }
          ]
        }
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
          id: "width",
          label: t("Width"),
          type: "slider",
          config: {
            min: 0,
            max: 1200,
            units: [{ value: "px", title: "px" }]
          },
          style: widthCSS
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
    }
  ];
};
