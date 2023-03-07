import { setIn } from "timm";
import { hideToolbar } from "visual/component/Toolbar";
import { detectOS } from "visual/utils/dom/detectOS";
import { setOffsetsToElementFromWrapper } from "visual/utils/models";
import { t } from "visual/utils/i18n";

const os = detectOS();
const isMac = os === "MacOS";

export default itemIndex => ({
  getItems: getItems(itemIndex)
});

const getItems = itemIndex => (v, component) => {
  const copiedElement = component.getCurrentCopiedElement();

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
          inactive: !copiedElement,
          onChange: () => {
            component.paste(itemIndex, sourceV => {
              const { offsetX = 0, offsetY = 0 } = v[
                itemIndex
              ].value.items[0].value;
              let newV = setIn(
                sourceV,
                ["value", "items", 0, "value", "offsetX"],
                offsetX
              );
              newV = setIn(
                newV,
                ["value", "items", 0, "value", "offsetY"],
                offsetY
              );
              return setOffsetsToElementFromWrapper(newV);
            });
          }
        },
        {
          id: "pasteStyles",
          type: "button",
          title: t("Paste Styles"),
          helperText: () => (isMac ? "⌘ + ⇧ + V" : "ctrl + ⇧ + V"),
          inactive: !copiedElement,
          onChange: () => component.pasteStyles(itemIndex)
        },
        {
          id: "duplicate",
          type: "button",
          title: t("Duplicate"),
          helperText: () => (isMac ? "⌘ + D" : "ctrl + D"),
          onChange: () =>
            component.insertItem(
              itemIndex + 1,
              setOffsetsToElementFromWrapper(v[itemIndex])
            )
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
