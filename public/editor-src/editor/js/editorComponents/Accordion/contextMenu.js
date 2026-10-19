import { t } from "visual/utils/i18n";

/**
 * getItems()
 * params v, component
 */
const getItems = () => [
  {
    id: "main",
    type: "group",
    title: t("Accordion"),
    disabled: (_item, meta) => meta.isInSubMenu,
    items: []
  }
];

export default { getItems };
