import { hideToolbar } from "visual/component/Toolbar";
import { detectOS } from "visual/utils/dom/detectOS";

import { t } from "visual/utils/i18n";

const os = detectOS();
const isMac = os === "MacOS";

const getKeyModifier = isInSubMenu => {
  if (isMac) {
    return isInSubMenu ? "alt" : "⌘";
  } else {
    return isInSubMenu ? "alt" : "ctrl";
  }
};

const getDeleteKey = isInSubMenu => {
  if (isMac) {
    return isInSubMenu ? "alt + delete" : "⌘ + delete";
  } else {
    return isInSubMenu ? "alt + delete" : "ctrl + delete";
  }
};

export default itemIndex => ({
  getItems: getItems(itemIndex)
});

const getItems = itemIndex => (v, component) => {
  // const dynamicItems = component.canAddColumn()
  //   ? [
  //       {
  //         id: "duplicate",
  //         type: "button",
  //         title: t("Add New"),
  //         helperText: ({ isInSubMenu }) => getKeyModifier(isInSubMenu) + " + N",
  //         onChange() {
  //           component.addColumn(itemIndex + 1);
  //         }
  //       }
  //     ]
  //   : [];

  const copiedElement = component.getCurrentCopiedElement();
  const canPaste = copiedElement && copiedElement.type !== "Row";

  return [
    {
      id: "main",
      type: "group",
      items: [
        // ...dynamicItems,
        {
          id: "copy",
          type: "button",
          title: t("Copy"),
          helperText: ({ isInSubMenu }) => getKeyModifier(isInSubMenu) + " + C",
          onChange: () => component.copy(itemIndex)
        },
        {
          id: "paste",
          type: "button",
          title: t("Paste"),
          helperText: ({ isInSubMenu }) => getKeyModifier(isInSubMenu) + " + V",
          inactive: !canPaste,
          onChange: () => component.paste(itemIndex)
        },
        {
          id: "pasteStyles",
          type: "button",
          title: t("Paste Styles"),
          helperText: ({ isInSubMenu }) =>
            getKeyModifier(isInSubMenu) + " + ⇧ + V",
          inactive: !canPaste,
          onChange: () => component.pasteStyles(itemIndex)
        },
        {
          id: "duplicate",
          type: "button",
          title: t("Duplicate"),
          helperText: ({ isInSubMenu }) => getKeyModifier(isInSubMenu) + " + D",
          onChange() {
            component.cloneItem(itemIndex);
          }
        },
        {
          id: "remove",
          type: "button",
          title: t("Delete"),
          helperText: ({ isInSubMenu }) => getDeleteKey(isInSubMenu),
          onChange() {
            hideToolbar();
            component.removeItem(itemIndex);
          }
        }
      ]
    }
  ];
};
