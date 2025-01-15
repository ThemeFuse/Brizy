import { getFlatShortcodes } from "visual/shortcodeComponents/utils";
import { getTranslationsMap } from "./contextMenu";

export default {
  getItems
};

function getItems(v, component) {
  const config = component.getGlobalConfig();
  const { essentials } = getFlatShortcodes(config);
  const { icon = "" } =
    essentials?.find(
      (item) => item.component.resolve.value.items?.type === v[0].type
    ) || {};
  const translation = getTranslationsMap();

  return [
    {
      id: "main",
      type: "group",
      title: translation[v[0].type], // TODO: See if we'll need icons & prop
      icon,
      items: []
    }
  ];
}
