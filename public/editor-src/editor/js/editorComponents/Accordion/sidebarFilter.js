import { t } from "visual/utils/i18n";

export const title = t("Accordion Tags");

export function getItems() {
  return [
    {
      id: "filterPadding",
      type: "padding-dev",
      label: t("Padding"),
      position: 50,
      config: {
        units: ["px"]
      }
    },
    {
      id: "filterBorder",
      type: "corners-dev",
      label: t("Corner"),
      position: 65
    }
  ];
}
