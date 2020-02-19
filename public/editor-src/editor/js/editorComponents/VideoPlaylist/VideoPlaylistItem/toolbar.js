import { getDynamicContentChoices } from "visual/utils/options";
import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarElementVideoControls,
  toolbarElementVideoStart,
  toolbarElementVideoEnd,
  toolbarElementVideoPlaySize
} from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device });

  const videoDynamicContentChoices = getDynamicContentChoices("richText");

  return [
    {
      id: dvk("toolbarCurrentElement"),
      type: "popover",
      icon: "nc-play",
      devices: "desktop",
      title: t("Video"),
      position: 80,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Video"),
              options: [
                {
                  id: "type",
                  label: t("Type"),
                  type: "select-dev",
                  choices: [
                    { value: "youtube", title: "Youtube" },
                    { value: "vimeo", title: "Vimeo" }
                  ]
                },
                {
                  id: "video",
                  label: t("Link"),
                  type: "inputText-dev",
                  devices: "desktop",
                  population: videoDynamicContentChoices,
                  config: {
                    placeholder:
                      v.type === "youtube"
                        ? t("Youtube")
                        : v.type === "vimeo"
                        ? t("Vimeo")
                        : ""
                  }
                }
              ]
            },
            {
              id: "tabCurrentElementAdvanced",
              label: t("Advanced"),
              options: [
                toolbarElementVideoControls({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal",
                  disabled: v.type === "vimeo"
                }),
                {
                  id: "branding",
                  label: t("Branding"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: v.controls !== "on" || v.type !== "youtube"
                },
                {
                  id: "intro",
                  label: t("Intro"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: v.type !== "vimeo"
                },
                {
                  id: "loop",
                  label: t("Loop"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                toolbarElementVideoStart({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarElementVideoEnd({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal",
                  disabled: v.type === "vimeo"
                })
              ]
            },
            {
              id: "tabCurrentElementCover",
              label: t("Cover"),
              options: [
                {
                  label: t("Cover"),
                  id: "cover",
                  type: "imageUpload-dev",
                  devices: "desktop"
                },
                {
                  id: "coverZoom",
                  label: t("Zoom"),
                  devices: "desktop",
                  type: "slider-dev",
                  config: {
                    min: 100,
                    max: 300,
                    units: [{ value: "%", title: "%" }]
                  }
                },
                toolbarElementVideoPlaySize({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: dvk("toolbarColor"),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      devices: "desktop",
      roles: ["admin"],
      position: 90,
      icon: {
        style: {
          color: hexToRgba(v.bgColorHex)
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabPlay",
              label: t("Play"),
              position: 20,
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER],
                  disabled: v.coverImageSrc === "" || v.autoplay === "on"
                }
              ]
            },
            {
              id: "tabIcon",
              label: t("Icon"),
              position: 30,
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER],
                  disabled: v.coverImageSrc === "" || v.autoplay === "on"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: dvk("toolbarSettings"),
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: dvk("advancedSettings"),
          type: "advancedSettings",
          label: t("More Settings"),
          position: 20,
          icon: "nc-cog"
        }
      ]
    }
  ];
}
