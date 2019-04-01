import { t } from "visual/utils/i18n";

export default {
  getItems
};

function getItems(v, component) {
  return [
    {
      id: "main",
      type: "group",
      title: t("Column"),
      icon: "nc-column",
      disabled: component.props.meta.posts,
      items: []
    }
  ];
}
