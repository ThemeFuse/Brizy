import produce from "immer";
import { Dispatch } from "redux";
import { ElementModel } from "visual/component/Elements/Types";
import {
  itemsToSymbols,
  normalizeMenuItems,
  symbolsToItems
} from "visual/editorComponents/Menu/utils";
import { Config } from "visual/global/Config";
import { ReduxAction, updateGlobalBlock } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";
import { Block } from "visual/types";
import { mapModels } from "visual/utils/models";
import { objectTraverse2 } from "visual/utils/object";
import { FromTo } from "../types";

type GlobalBlocks = ReduxState["globalBlocks"];

//#region Global Blocks

type Source = FromTo["from"] | FromTo["to"];

export function attachGlobalBlocks(
  value: ElementModel,
  source: Source,
  gb: GlobalBlocks
): ElementModel {
  if ("itemPath" in source) {
    const { itemPath = [] } = source;

    return produce(value, (draft) => {
      let cursor = draft;
      let i = 0;

      do {
        if (!cursor) {
          break;
        } else if (
          cursor.type &&
          cursor.type === "GlobalBlock" &&
          cursor.value
        ) {
          // @ts-expect-error: _id is not the type unknowns
          const { _id } = cursor.value;

          if (gb[_id]) {
            Object.assign(cursor, gb[_id].data, {
              __tmp_global_original__: JSON.stringify(cursor)
            });
          }
        }

        // @ts-expect-error: Type 'unknown' is not assignable to type '{ [x: string]: unknown; }'.
        cursor = cursor[itemPath[i++]];
      } while (i < itemPath.length);
    });
  }

  return value;
}

export function detachGlobalBlocks(
  value: ElementModel,
  dispatch: Dispatch<ReduxAction>
): ElementModel {
  const globalBlockUpdates: Array<string[]> = [];

  const ret = produce(value, (draft) => {
    objectTraverse2(draft, (obj: ElementModel) => {
      if (obj.__tmp_global_original__) {
        // restore replaced global block (1)
        // @ts-expect-error: Argument of type 'unknown' is not assignable to parameter of type 'string'.
        const tmp = JSON.parse(obj.__tmp_global_original__);
        delete obj.__tmp_global_original__;

        // mark up global block for later update
        globalBlockUpdates.push([tmp.value._id as string, JSON.stringify(obj)]);

        // restore replaced global block (2)
        Object.assign(obj, tmp);
      }
    });
  });

  if (globalBlockUpdates.length) {
    for (const [_id, dataStringified] of globalBlockUpdates) {
      dispatch(
        updateGlobalBlock({
          id: _id,
          data: JSON.parse(dataStringified)
        })
      );
    }
  }

  return ret;
}

export function gbTransform(
  data: ElementModel,
  gb: GlobalBlocks
): ElementModel {
  return mapModels((model: Block) => {
    if (model.type === "GlobalBlock") {
      const { _id } = model.value;

      if (gb[_id] && gb[_id].data) {
        return gb[_id].data;
      }
    }

    return model;
  }, data);
}

//#endregion

//#region Menu

export function attachMenu(value: ElementModel, config: Config): ElementModel {
  const { menuData } = config;

  if (menuData === undefined) {
    return value;
  }

  return mapModels((block: ElementModel) => {
    const { type, value } = block;

    if (type === "Menu") {
      const { menuSelected: dbMenuSelected, symbols = {} } = value as {
        menuSelected: string;
        symbols: Record<string, unknown>;
      };
      const menuSelected = dbMenuSelected || menuData[0]?.id;
      const menuConfig = menuData.find((menu) => menu.id === menuSelected) || {
        items: []
      };
      const items = normalizeMenuItems(menuConfig.items);

      return produce(block, (draft) => {
        //@ts-expect-error: Object is of type 'unknown'
        draft.value.items = symbolsToItems(items, symbols);
      });
    }

    return block;
  }, value);
}

export function detachMenu(value: ElementModel): ElementModel {
  return mapModels((block: ElementModel) => {
    const { type, value } = block as { type: string; value: ElementModel };

    if (type === "Menu" && value.items) {
      return produce(block, (draft) => {
        Object.assign(
          //@ts-expect-error: Object is of type 'unknown'.
          draft.value.symbols || {},
          //@ts-expect-error: Object is of type 'unknown'.
          itemsToSymbols(draft.value.items)
        );
        //@ts-expect-error: Object is of type 'unknown'.
        delete draft.value.items;
      });
    }

    return block;
  }, value);
}

//#endregion
