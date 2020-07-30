import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";

export function getItems({ device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });

  return [
    {
      id: "settingsTabs",
      type: "tabs-dev",
      config: {
        align: "start"
      },
      tabs: [
        {
          id: dvk("moreSettingsAdvanced"),
          label: t("Advanced"),
          icon: "nc-cog",
          options: [
            {
              id: "zIndex",
              type: "slider-dev",
              disabled: true
            },
            {
              id: "showOnDesktop",
              type: "switch-dev",
              disabled: true
            }
          ]
        }
      ]
    }
  ];
}
