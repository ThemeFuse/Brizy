import { hasInfiniteAnimation } from "visual/component/HoverAnimation/utils";
import { isWp } from "visual/global/Config/types/configs/WP";
import { t } from "visual/utils/i18n";
import { isGIFExtension, isSVGExtension } from "visual/utils/image/utils";
import { defaultValueValue } from "visual/utils/onChange";
import { hoverEffects } from "visual/utils/options/Animation/utils";
import { read as readString } from "visual/utils/string/specs";
import { GetItems } from "../EditorComponent/types";
import { V } from "../Image/types";
import type { Props } from "./types";

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

export const getItems: GetItems<V, Props> = ({ v, device, component }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const config = component.getGlobalConfig();

  const imageExtension = dvv("imageExtension");
  const imageSrc = dvv("imageSrc");
  const hoverName = readString(dvv("hoverName")) ?? "none";

  const is_wp = isWp(config);

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
                      id: "border",
                      label: t("Corner"),
                      type: "corners",
                      position: 80
                    },
                    {
                      id: "blendMode",
                      label: t("Blending Mode"),
                      type: "select",
                      position: 100,
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
                      position: 100,
                      type: "slider",
                      config: {
                        min: 0,
                        max: 99,
                        units: [{ title: "ms", value: "ms" }]
                      }
                    },
                    {
                      id: "alt",
                      type: "inputText",
                      label: t("Alt Title"),
                      display: "block",
                      helper: {
                        content: t(
                          "Specify an alternate text for the image, if it cannot be displayed."
                        )
                      }
                    },
                    {
                      id: "showOriginalImage",
                      type: "switch",
                      label: t("Show Original image"),
                      disabled:
                        !is_wp ||
                        isSVGExtension(imageExtension) ||
                        isGIFExtension(imageExtension) ||
                        !imageSrc
                    }
                  ]
                }
              ]
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
                  options: []
                },
                {
                  id: "tabHover",
                  label: t("Hover"),
                  options: [
                    {
                      id: "hover",
                      type: "animation",
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
