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
      title: t("Row"),
      disabled: v.showToolbar === "off" || inPopup,
      items: []
    }
  ];
}
