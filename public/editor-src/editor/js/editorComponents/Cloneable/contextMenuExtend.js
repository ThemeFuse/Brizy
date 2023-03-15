import { hideToolbar } from "visual/component/Toolbar";
import { detectOS } from "visual/utils/dom/detectOS";
import { t } from "visual/utils/i18n";

export default itemIndex => ({
  getItems: getItems(itemIndex)
});

const os = detectOS();
const isMac = os === "MacOS";

const getItems = itemIndex => (v, component) => {
  const copiedElement = component.getCurrentCopiedElement();

  const canPaste = copiedElement && copiedElement.type === v[itemIndex].type;
  return [
    {
      id: "main",
      type: "group",
      items: [
        {
          id: "copy",
          type: "button",
          title: t("Copy"),
          helperText: () => (isMac ? "⌘ + C" : "ctrl + C"),
          onChange: () => component.copy(itemIndex)
        },
        {
          id: "paste",
          type: "button",
          title: t("Paste"),
          helperText: () => (isMac ? "⌘ + V" : "ctrl + V"),
          inactive: !canPaste,
          onChange: () => component.paste(itemIndex)
        },
        {
          id: "pasteStyles",
          type: "button",
          title: t("Paste Styles"),
          helperText: () => (isMac ? "⌘ + ⇧ + V" : "ctrl + ⇧ + V"),
          inactive: !canPaste,
          onChange: () => component.pasteStyles(itemIndex)
        },
        {
          id: "duplicate",
          type: "button",
          title: t("Duplicate"),
          helperText: () => (isMac ? "⌘ + D" : "ctrl + D"),
          onChange: () => {
            component.cloneItem(itemIndex);
          }
        },
        {
          id: "remove",
          type: "button",
          title: t("Delete"),
          helperText: () => (isMac ? "⌘ + delete" : "ctrl + delete"),
          onChange: () => {
            hideToolbar();
            component.removeItem(itemIndex);
          }
        }
      ]
    }
  ];
};
