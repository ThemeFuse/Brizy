import { isPopup } from "visual/providers/EditorModeProvider";
import { t } from "visual/utils/i18n";

export default {
  getItems
};

function getItems(v, component) {
  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);
  const editorMode = component.props.editorMode;

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
          isPopup(editorMode) ||
          meta.isInSubMenu
        );
      },
      items: []
    }
  ];
}
