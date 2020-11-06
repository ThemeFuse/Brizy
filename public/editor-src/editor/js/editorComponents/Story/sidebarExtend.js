import { t } from "visual/utils/i18n";
import { toolbarCustomCSSClass } from "visual/utils/toolbar";
import { getDynamicContentChoices } from "visual/utils/options";

export function getItems({ v, device }) {
  const cssIDDynamicContentChoices = getDynamicContentChoices("richText", true);

  return [
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
          options: []
        },
        {
          id: "moreSettingsAdvanced",
          label: t("Advanced"),
          icon: "nc-cog",
          options: [
            toolbarCustomCSSClass({
              v,
              device,
              devices: "desktop",
              state: "normal",
              population: cssIDDynamicContentChoices
            })
          ]
        }
      ]
    }
  ];
}
