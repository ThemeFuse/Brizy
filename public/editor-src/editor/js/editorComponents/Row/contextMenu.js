import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { isPopup } from "visual/utils/models";

export default {
  getItems
};

function getItems(v, component) {
  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);

  return [
    {
      id: "main",
      type: "group",
      icon: "nc-row",
      title: t("Row"),
      disabled: (item, meta) => {
        return (
          v.showToolbar === "off" ||
          inPopup ||
          inPopup2 ||
          isPopup(Config.getAll()) ||
          meta.isInSubMenu
        );
      },
      items: []
    }
  ];
}
