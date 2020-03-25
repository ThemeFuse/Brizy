import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarDisabledZIndex,
  toolbarDisabledShowOnDesktop
} from "visual/utils/toolbar";

export function getItems({ device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });

  return [
    {
      id: dvk("settingsTabs"),
      type: "tabs",
      align: "start",
      tabs: [
        {
          id: dvk("moreSettingsAdvanced"),
          label: t("Advanced"),
          tabIcon: "nc-cog",
          options: [toolbarDisabledZIndex(), toolbarDisabledShowOnDesktop({})]
        }
      ]
    }
  ];
}
