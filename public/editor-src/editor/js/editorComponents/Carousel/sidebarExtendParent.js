import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";

import {
  toolbarDisabledPadding,
  toolbarElementCarouselPadding
} from "visual/utils/toolbar";

export const title = t("Carousel");

const helperHTML = `
<p class="brz-p">You can use the following selectors to create targeted CSS.</p>
<p class="brz-p">
  <span class="brz-span brz-ed-tooltip__overlay-code">element</span> {...}
  <br class="brz-br">
  <span class="brz-span brz-ed-tooltip__overlay-code">element .child-element</span> {...}
</p>`;

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  return [
    toolbarDisabledPadding({
      device,
      devices: "responsive",
      state: "normal"
    }),
    toolbarElementCarouselPadding({
      v,
      device,
      devices: "responsive",
      state: "normal"
    }),
    {
      id: "settingsTabs",
      type: "tabs-dev",
      config: {
        align: "start"
      },
      tabs: [
        {
          id: "settingsStyling",
          label: t("Styling"),
          icon: "nc-styling",
          options: [
            toolbarDisabledPadding({
              device,
              devices: "desktop",
              state: "normal"
            }),
            toolbarElementCarouselPadding({
              v,
              device,
              devices: "desktop",
              state: "normal"
            })
          ]
        },
        {
          id: dvk("moreSettingsAdvanced"),
          label: t("Advanced"),
          icon: "nc-cog",
          options: [
            {
              id: "customCSS",
              label: t("Custom CSS"),
              type: "codeMirror-dev",
              position: 45,
              display: "block",
              devices: "desktop",
              helper: { content: helperHTML },
              placeholder: "element { CSS goes here }"
            }
          ]
        }
      ]
    }
  ];
}
