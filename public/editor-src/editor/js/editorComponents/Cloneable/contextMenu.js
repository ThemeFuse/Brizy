import Editor from "visual/global/Editor";
import { t } from "visual/utils/i18n";

const translationsMap = {
  Button: t("Button"),
  Icon: t("Icon")
};

export default {
  getItems
};

function getItems(v) {
  const { base } = Editor.getShortcodes();

  const { icon = "" } =
    base.find(
      ({
        resolve: {
          value: {
            items: [{ type }]
          }
        }
      }) => type === v[0].type
    ) || {};

  return [
    {
      id: "main",
      type: "group",
      title: translationsMap[v[0].type], // TODO: See if we'll need icons & prop
      icon,
      items: []
    }
  ];
}
