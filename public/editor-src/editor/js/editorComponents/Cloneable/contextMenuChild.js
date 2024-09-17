import Editor from "visual/global/Editor";
import { translationsMap } from "./contextMenu";

export default {
  getItems
};

function getItems(v) {
  const { essentials } = Editor.getShortcodes();

  const { icon = "" } =
    essentials?.find(
      (item) => item.component.resolve.value.items?.type === v[0].type
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
