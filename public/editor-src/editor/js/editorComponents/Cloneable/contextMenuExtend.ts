import { Obj } from "@brizy/readers";
import {
  copyKeyModifier,
  deleteKeyModifier,
  duplicateKeyModifier,
  navigatorKeyModifier,
  pasteKeyModifier,
  pasteStylesKeyModifier
} from "visual/component/ContextMenu/utils";
import type {
  ElementModel,
  ElementModelType2
} from "visual/component/Elements/Types";
import { openNavigatorFromContextMenu } from "visual/component/Navigator/utils";
import { hideToolbar } from "visual/component/Toolbar";
import { readElementType } from "visual/global/Config/types/configs/ElementTypes";
import { symbolsSelector } from "visual/redux/selectors";
import { t } from "visual/utils/i18n";
import type { ElementModelWithSymbols } from "visual/utils/symbols/types";
import type { MValue } from "visual/utils/value";
import { handleComponentSymbolCreate } from "../../utils/symbols";
import EditorArrayComponent from "../EditorArrayComponent";

const getItems =
  (itemIndex: number) => (v: ElementModel, component: EditorArrayComponent) => {
    const model = v[itemIndex] as MValue<ElementModelType2>;

    const { type: _type, value: _value } = model ?? {};
    const type = readElementType(_type);
    const value = Obj.read(_value);

    const copiedElement =
      component.getCurrentCopiedElement() as unknown as ElementModelType2;

    const canPaste =
      copiedElement &&
      copiedElement.type === (v[itemIndex] as ElementModelType2).type;

    const store = component.getReduxStore().getState();
    const symbols = symbolsSelector(store);

    const currentSymbolUid = (value as ElementModelWithSymbols)?.classes?.[0];

    const symbolModel = symbols.classes.find((s) => s.uid === currentSymbolUid)
      ?.model.v;

    return [
      {
        id: "main",
        type: "group",
        items: [
          {
            id: "symbol",
            type: "button",
            title: t("Create Symbol"),
            helperText: () => "",
            disabled: true,
            onChange: () => {
              if (type && value) {
                handleComponentSymbolCreate({
                  type,
                  value: {
                    ...symbolModel,
                    ...value
                  },
                  store,
                  dispatch: component.getReduxDispatch()
                });
              }
            }
          },
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
            inactive: !canPaste,
            onChange: () => component.paste(itemIndex)
          },
          {
            id: "pasteStyles",
            type: "button",
            title: t("Paste Styles"),
            helperText: () => pasteStylesKeyModifier,
            inactive: !canPaste,
            onChange: () => component.pasteStyles(itemIndex)
          },
          {
            id: "duplicate",
            type: "button",
            title: t("Duplicate"),
            helperText: () => duplicateKeyModifier,
            onChange: () => {
              component.cloneItem(itemIndex);
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

export default (itemIndex: number) => ({
  getItems: getItems(itemIndex)
});
