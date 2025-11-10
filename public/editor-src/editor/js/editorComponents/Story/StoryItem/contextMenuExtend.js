import { setIn } from "timm";
import {
  copyKeyModifier,
  deleteKeyModifier,
  duplicateKeyModifier,
  navigatorKeyModifier,
  pasteKeyModifier,
  pasteStylesKeyModifier
} from "visual/component/ContextMenu/utils";
import { openNavigatorFromContextMenu } from "visual/component/Navigator/utils";
import { hideToolbar } from "visual/component/Toolbar";
import { rulesSelector } from "visual/redux/selectors";
import { t } from "visual/utils/i18n";
import { setOffsetsToElementFromWrapper } from "visual/utils/models";

export default (itemIndex) => ({
  getItems: getItems(itemIndex)
});

const getItems = (itemIndex) => (v, component) => {
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
          helperText: () => copyKeyModifier,
          onChange: () => component.copy(itemIndex)
        },
        {
          id: "paste",
          type: "button",
          title: t("Paste"),
          helperText: () => pasteKeyModifier,
          inactive: !copiedElement,
          onChange: () => {
            const rules = rulesSelector(component.getReduxStore().getState());
            component.paste(itemIndex, (sourceV) => {
              const { offsetX = 0, offsetY = 0 } =
                v[itemIndex].value.items[0].value;
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
              return setOffsetsToElementFromWrapper(newV, rules);
            });
          }
        },
        {
          id: "pasteStyles",
          type: "button",
          title: t("Paste Styles"),
          helperText: () => pasteStylesKeyModifier,
          inactive: !copiedElement,
          onChange: () => component.pasteStyles(itemIndex)
        },
        {
          id: "duplicate",
          type: "button",
          title: t("Duplicate"),
          helperText: () => duplicateKeyModifier,
          onChange: () => {
            const rules = rulesSelector(component.getReduxStore().getState());

            component.insertItem(
              itemIndex + 1,
              setOffsetsToElementFromWrapper(v[itemIndex], rules)
            );
          }
        },
        {
          id: "remove",
          type: "button",
          title: t("Delete"),
          helperText: () => deleteKeyModifier,
          onChange: () => {
            hideToolbar();
            component.removeItem(itemIndex);
          }
        },
        {
          id: "showNavigator",
          type: "button",
          title: t("Explorer"),
          icon: "nc-navigator",
          helperText: () => navigatorKeyModifier,
          onChange: () => openNavigatorFromContextMenu(component, itemIndex)
        }
      ]
    }
  ];
};
