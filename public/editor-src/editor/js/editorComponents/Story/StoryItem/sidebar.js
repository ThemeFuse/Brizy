import { t } from "visual/utils/i18n";

export const title = () => t("Story");

export function getItems() {
  return [
    {
      id: "settingsTabs",
      type: "tabs",
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
          options: []
        }
      ]
    }
  ];
}
