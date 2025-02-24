import { Params } from "visual/editorComponents/EditorComponent/types";
import { isStory } from "visual/providers/EditorModeProvider";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ToolbarItemType } from "../ToolbarItemType";
import { Value } from "./toolbar";

export const title = () => t("Rating");

const getHtml = () => {
  return `
<p class="brz-p">${t(
    "You can use the following selectors to create targeted CSS."
  )}</p>
<p class="brz-p">
  <span class="brz-span brz-ed-tooltip__overlay-code">element</span> {...}
  <br class="brz-br">
  <span class="brz-span brz-ed-tooltip__overlay-code">element .child-element</span> {...}
</p>`;
};

export function getItems({
  v,
  device,
  editorMode
}: Params<Value>): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const isStyle1 = dvv("ratingStyle") === "style1";

  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "settingsTabs",
              type: "tabs",
              config: { align: "start" },
              devices: "desktop",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  options: [
                    {
                      id: "border",
                      type: "corners",
                      label: t("Corner"),
                      disabled: isStyle1
                    }
                  ]
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  options: [
                    {
                      id: "customCSS",
                      label: t("Custom CSS"),
                      type: "codeMirror",
                      position: 45,
                      display: "block",
                      devices: "desktop",
                      helper: { content: getHtml() },
                      placeholder: `element { ${t("CSS goes here")} }`
                    },
                    {
                      id: "hoverTransition",
                      label: t("Hover Transition"),
                      disabled: isStory(editorMode),
                      position: 70,
                      devices: "desktop",
                      type: "slider",
                      config: {
                        min: 0,
                        max: 99,
                        units: [{ title: "ms", value: "ms" }]
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "border",
              type: "corners",
              label: t("Corner"),
              devices: "responsive",
              disabled: isStyle1
            }
          ]
        }
      ]
    }
  ];
}
