import { ElementModel } from "visual/component/Elements/Types";
import { hasInfiniteAnimation } from "visual/component/HoverAnimation/utils";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isStory } from "visual/providers/EditorModeProvider";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { hoverEffects } from "visual/utils/options/Animation/utils";
import { read as readString } from "visual/utils/string/specs";
import { GetItems } from "../EditorComponent/types";

export const title = () => t("Column");

export const getItems: GetItems<ElementModel> = ({
  v,
  device,
  context,
  editorMode
}) => {
  const toolbarTagsChoices = [
    { title: "Div", value: "div" },
    { title: t("Header"), value: "header" },
    { title: t("Footer"), value: "footer" },
    { title: t("Main"), value: "main" },
    { title: t("Article"), value: "article" },
    { title: t("Section"), value: "section" },
    { title: t("Aside"), value: "aside" },
    { title: t("Nav"), value: "nav" }
  ];
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

  const _isStory = isStory(editorMode);
  const hoverName = readString(dvv("hoverName")) ?? "none";

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
              id: "tabs",
              type: "tabs",
              config: {
                align: "start"
              },
              devices: "desktop",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  icon: "nc-styling",
                  options: [
                    {
                      id: "showOnDesktop",
                      label: t("Show on Desktop"),
                      type: "switch",
                      closeTooltip: true,
                      position: 10,
                      devices: "desktop"
                    },
                    {
                      id: "padding",
                      type: "padding",
                      label: t("Padding"),
                      devices: "desktop",
                      position: 50
                    },
                    {
                      id: "margin",
                      label: t("Margin"),
                      type: "margin",
                      devices: "desktop",
                      position: 60
                    },
                    {
                      id: "border",
                      type: "corners",
                      label: t("Corner"),
                      devices: "desktop",
                      position: 65
                    },
                    {
                      id: "blendMode",
                      label: t("Blending Mode"),
                      type: "select",
                      devices: "desktop",
                      position: 80,
                      choices: [
                        { title: t("Normal"), value: "normal" },
                        { title: t("Color"), value: "color" },
                        { title: t("Color Burn"), value: "color-burn" },
                        { title: t("Color Dodge"), value: "color-dodge" },
                        { title: t("Darken"), value: "darken" },
                        { title: t("Difference"), value: "difference" },
                        { title: t("Exclusion"), value: "exclusion" },
                        { title: t("Hue"), value: "hue" },
                        { title: t("Lighten"), value: "lighten" },
                        { title: t("Luminosity"), value: "luminosity" },
                        { title: t("Multiply"), value: "multiply" },
                        { title: t("Overlay"), value: "overlay" },
                        { title: t("Saturation"), value: "saturation" },
                        { title: t("Screen"), value: "screen" }
                      ]
                    }
                  ]
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  icon: "nc-cog",
                  options: [
                    {
                      id: "zIndex",
                      type: "slider",
                      position: 20,
                      label: t("Z-index"),
                      devices: "desktop",
                      config: {
                        min: 0,
                        max: 100
                      }
                    },
                    {
                      id: "cssID",
                      label: t("CSS ID"),
                      type: "population",
                      position: 30,
                      devices: "desktop",
                      display: "block",
                      helper: {
                        content: t(
                          "Add your custom ID without the #pound, example: my-id"
                        )
                      },
                      config: richTextDC,
                      option: {
                        id: "customID",
                        type: "inputText"
                      }
                    },
                    {
                      id: "cssClass",
                      label: t("CSS Class"),
                      type: "population",
                      position: 40,
                      devices: "desktop",
                      display: "block",
                      helper: {
                        content: t(
                          "Add your custom class without the .dot, example: my-class"
                        )
                      },
                      config: richTextDC,
                      option: {
                        id: "customClassName",
                        type: "inputText"
                      }
                    },
                    {
                      id: "customAttributes",
                      label: t("Custom Attributes"),
                      type: "codeMirror",
                      position: 45,
                      placeholder: 'key1:"value1"\nkey2:"value2"',
                      display: "block",
                      devices: "desktop",
                      helper: {
                        content: t(
                          "Set your custom attribute for wrapper element. Each attribute in a separate line. Separate attribute key from the value using : character."
                        )
                      },
                      population: richTextDC
                    },
                    {
                      id: "hoverTransition",
                      label: t("Hover Transition"),
                      devices: "desktop",
                      position: 60,
                      type: "slider",
                      config: {
                        min: 0,
                        max: 99,
                        units: [{ title: "ms", value: "ms" }]
                      }
                    },
                    {
                      id: "tagName",
                      label: t("HTML Tag"),
                      type: "select",
                      choices: toolbarTagsChoices
                    }
                  ]
                }
              ]
            },
            {
              id: "padding",
              type: "padding",
              label: t("Padding"),
              devices: "responsive",
              position: 50
            },
            {
              id: "margin",
              label: t("Margin"),
              type: "margin",
              devices: "responsive",
              position: 60
            },
            {
              id: "border",
              type: "corners",
              label: t("Corner"),
              devices: "responsive",
              position: 65
            }
          ]
        },
        {
          id: "effects",
          title: t("Effects"),
          label: t("Effects"),
          options: [
            {
              id: "tabs",
              type: "tabs",
              config: {
                align: "start"
              },
              tabs: [
                {
                  id: "entrance",
                  label: t("Entrance"),
                  options: [
                    {
                      id: "animation",
                      type: "animation"
                    }
                  ]
                },
                {
                  id: "tabHover",
                  label: t("Hover"),
                  options: [
                    {
                      id: "hover",
                      type: "animation",
                      disabled: _isStory,
                      devices: "desktop",
                      config: {
                        types: hoverEffects,
                        replay: false,
                        infiniteAnimation: hasInfiniteAnimation(hoverName),
                        delay: false
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
