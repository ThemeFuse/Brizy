import { t } from "visual/utils/i18n";

export default {
  getItems
};

function getItems(v, component) {
  const inPopup = Boolean(component.props.meta.sectionPopup);

  return [
    {
      id: "main",
      type: "group",
      icon: "nc-row",
      title: t("Row"),
      disabled: (item, meta) => {
        return v.showToolbar === "off" || inPopup || meta.isInSubMenu;
      },
      items: []
    }
  ];
}
