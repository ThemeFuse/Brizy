import { t } from "visual/utils/i18n";

export const title = () => t("Accordion Tags");

export function getItems() {
  return [
    {
      id: "filterPadding",
      type: "padding",
      label: t("Padding"),
      position: 50,
      config: {
        units: ["px"]
      }
    },
    {
      id: "filterBorder",
      type: "corners",
      label: t("Corner"),
      position: 65
    }
  ];
}
