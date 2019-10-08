import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";

const { isGlobalPopup: IS_GLOBAL_POPUP } = Config.get("wp") || {};

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
        return (
          v.showToolbar === "off" || inPopup || IS_GLOBAL_POPUP || meta.isInSubMenu
        );
      },
      items: []
    }
  ];
}
