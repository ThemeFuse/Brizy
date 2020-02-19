import { t } from "visual/utils/i18n";
import {
  toolbarShowOnDesktop,
  toolbarZIndex,
  toolbarMargin,
  toolbarCustomCSSClass,
  toolbarAttributes,
  toolbarAnchorName,
  toolbarTags
} from "visual/utils/toolbar";
import { getDynamicContentChoices } from "visual/utils/options";
import { defaultValueKey } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });

  const cssIDDynamicContentChoices = getDynamicContentChoices("richText");

  return [
    {
      id: dvk("settingsTabs"),
      type: "tabs",
      align: "start",
      tabs: [
        {
          id: dvk("settingsStyling"),
          label: t("Styling"),
          tabIcon: "nc-styling",
          options: [
            toolbarMargin({
              v,
              device,
              state: "normal",
              onChangeGrouped: ["onChangeMarginGrouped"],
              onChangeUngrouped: ["onChangeMarginUngrouped"]
            })
          ]
        },
        {
          id: dvk("moreSettingsAdvanced"),
          label: t("Advanced"),
          tabIcon: "nc-cog",
          options: [
            toolbarShowOnDesktop({
              v,
              device,
              devices: "desktop",
              closeTooltip: true
            }),
            toolbarZIndex({
              v,
              device,
              devices: "desktop",
              state: "normal"
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
            }),
            toolbarTags({
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
