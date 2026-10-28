import type { Params } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isStory } from "visual/providers/EditorModeProvider";
import { getColorToolbar } from "visual/utils/color";
import { shouldRunEmbedCodeInEditor } from "visual/utils/elements/embedCode";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import type { ToolbarItemType } from "../ToolbarItemType";
import type { Value } from "./types";

export function getItems({
  v,
  device,
  editorMode,
  context,
  component
}: Params<Value>): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const codeNotRunning = !shouldRunEmbedCodeInEditor(
    component.getGlobalConfig()
  );

  const borderColor = getColorToolbar(
    dvv("borderColorPalette"),
    dvv("borderColorHex"),
    dvv("borderColorOpacity")
  );

  const embedDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.embed
  });

  const _isStory = isStory(editorMode);

  return [
    {
      id: "popoverCode",
      type: "popover",
      config: {
        icon: "nc-iframe",
        size: "large",
        title: t("Embed")
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "consentCategory",
          label: t("Consent category"),
          type: "select",
          choices: [
            { title: t("Auto"), value: "auto" },
            { title: t("Preferences"), value: "preferences" },
            { title: t("Statistics"), value: "statistics" },
            { title: t("Marketing"), value: "marketing" },
            { title: t("Other"), value: "other" }
          ],
          helper: {
            content: t(
              'Consent category for the external &lt;script src&gt; tags in this code. It only matters on pages that have the cookie banner; everywhere else the scripts run as usual. Auto lets the banner decide: a known vendor gets its own category, an unknown host falls under Other, and first-party scripts are not blocked. Pick a category and it is applied to every external script that doesn\'t already have a data-brz-consent attribute. Inline scripts are left alone either way. To gate one, write it as &lt;script type="text/plain" data-brz-consent="…"&gt;.'
            )
          }
        },
        {
          id: "code",
          type: "codeMirror",
          placeholder: t("Paste your HTML code here..."),
          config: {
            language: "html"
          },
          display: "block",
          className: "brz-embed-code-dc",
          population: embedDC,
          ...(codeNotRunning && {
            label: t("Custom code"),
            helper: {
              content: t(
                "The embed code is not running in the editor. It works normally in preview."
              )
            }
          })
        }
      ]
    },
    {
      id: "popoverColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: borderColor
          }
        }
      },
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER]
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
      disabled: _isStory,
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          config: {
            min: 1,
            max: dvv("widthSuffix") === "px" ? 1000 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        },
        {
          id: "groupHeightSize",
          type: "group",
          options: [
            {
              id: "heightStyle",
              label: t("Height"),
              type: "select",
              choices: [
                { title: t("Auto"), value: "auto" },
                { title: t("Custom"), value: "custom" }
              ]
            },
            {
              id: "height",
              type: "slider",
              disabled: dvv("heightStyle") !== "custom",
              config: {
                min: 20,
                max: 10000,
                units: [{ value: "px", title: "px" }]
              }
            }
          ]
        },
        {
          id: "overflow",
          label: t("Overflow"),
          type: "switch",
          helper: {
            content: t(
              "Shows, in preview only, the content that renders outside the element box."
            )
          }
        },
        {
          id: "grid",
          type: "grid",
          config: { separator: true },
          columns: [
            {
              id: "grid-settings",
              size: 1,
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
              id: "grid-effects",
              size: 1,
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
      position: 110,
      disabled: !_isStory,
      devices: "desktop"
    }
  ];
}
