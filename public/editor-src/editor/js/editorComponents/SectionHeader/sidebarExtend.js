import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import { getDynamicContentChoices } from "visual/utils/options";
import {
  toolbarShowOnDesktop,
  toolbarAnchorName,
  toolbarCustomCSSClass,
  toolbarAttributes
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const cssIDDynamicContentChoices = getDynamicContentChoices("richText");

  return [
    {
      id: dvk("settingsTabs"),
      type: "tabs",
      align: "start",
      devices: "desktop",
      tabs: [
        {
          id: dvk("moreSettingsAdvanced"),
          label: t("Advanced"),
          tabIcon: "nc-cog",
          devices: "desktop",
          options: [
            toolbarShowOnDesktop({
              v,
              device,
              devices: "desktop",
              closeTooltip: true
            }),
            toolbarAnchorName({
              v,
              device,
              devices: "desktop",
              state: "normal",
              population: cssIDDynamicContentChoices
            }),
            toolbarCustomCSSClass({
              v,
              device,
              devices: "desktop",
              state: "normal",
              population: cssIDDynamicContentChoices
            }),
            toolbarAttributes({
              v,
              device,
              devices: "desktop",
              state: "normal"
            })
          ]
        }
      ]
    }
  ];
}
