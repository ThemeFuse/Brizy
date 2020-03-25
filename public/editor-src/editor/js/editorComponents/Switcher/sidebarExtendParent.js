import { toolbarCustomCSS } from "visual/utils/toolbar";
import { t } from "visual/utils/i18n";

export const title = t("Switcher");

export function getItems({ v }) {
  return [
    {
      id: "settingsTabs",
      type: "tabs",
      devices: "desktop",
      align: "start",
      tabs: [
        {
          id: "moreSettingsAdvanced",
          label: t("Advanced"),
          tabIcon: "nc-cog",
          options: [toolbarCustomCSS({ v })]
        }
      ]
    }
  ];
}
