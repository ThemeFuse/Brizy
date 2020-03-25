import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";

export function getItems() {
  const dvk = key => defaultValueKey({ key, state: "normal" });

  return [
    {
      id: dvk("toolbarAccordion"),
      type: "popover",
      icon: "nc-toggle",
      title: t("Accordion"),
      position: 80,
      options: [
        {
          id: "enableTags",
          label: t("Enable tags"),
          type: "switch-dev"
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
    }
  ];
}
