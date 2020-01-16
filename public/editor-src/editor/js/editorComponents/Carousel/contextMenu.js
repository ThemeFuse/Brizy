import { t } from "visual/utils/i18n";

const getItems = () => [
  {
    id: "main",
    type: "group",
    title: t("Carousel"),
    icon: "nc-carousel",
    disabled: (item, meta) => meta.isInSubMenu,
    // disabled: (item, meta) => false,
    items: []
  }
];

export default {
  getItems
};
