import { t } from "visual/utils/i18n";

/**
 * getItems()
 * params v, component
 */
const getItems = () => [
  {
    id: "main",
    type: "group",
    title: t("Filters"),
    icon: "nc-filters",
    disabled: (item, meta) => meta.isInSubMenu,
    items: []
  }
];

export default { getItems };
