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

  const containRow = v[itemIndex].type === "Row";
  const canPaste =
    copiedElement && (containRow || v[itemIndex].type === copiedElement.type);

  const canPasteStyles =
    canPaste &&
    (containRow ||
      copiedElement.value.items[0].type === v[itemIndex].value.items[0].type);

  return [
    {
      id: "main",
      type: "group",
      items: [
        {
          id: "copy",
          type: "button",
          title: t("Copy"),
          helperText: () => (isMac ? "⌘ + C" : "Ctrl + C"),
          onChange: () => component.copy(itemIndex)
        },
        {
          id: "paste",
          type: "button",
          title: t("Paste"),
          helperText: () => (isMac ? "⌘ + V" : "Ctrl + V"),
          inactive: !canPaste,
          onChange: () => component.paste(itemIndex)
        },
        {
          id: "pasteStyles",
          type: "button",
          title: t("Paste Styles"),
          inactive: !canPasteStyles,
          helperText: () => (isMac ? "⌘ + ⇧ + V" : "Ctrl + ⇧ + V"),
          onChange: () => component.pasteStyles(itemIndex)
        },
        {
          id: "duplicate",
          type: "button",
          title: t("Duplicate"),
          helperText: () => (isMac ? "⌘ + D" : "Ctrl + D"),
          onChange: () => {
            component.cloneItem(itemIndex);
          }
        },
        {
          id: "remove",
          type: "button",
          title: t("Delete"),
          helperText: () => (isMac ? "⌘ + delete" : "Delete"),
          onChange: () => {
            hideToolbar();
            component.removeItem(itemIndex);
          }
        }
      ]
    }
  ];
};
