import { omit, pick } from "es-toolkit";
import { produce } from "immer";
import {
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import { MenuItem } from "visual/global/Config/types/configs/ConfigCommon";
import { mapModels, setIds } from "visual/utils/models";

const configKeys = [
  "id",
  "title",
  "url",
  "target",
  "items",
  "megaMenuItems",
  "attrTitle",
  "classes",
  "liClasses",
  "current",
  "editorUrl"
] as const;

type ConfigKeys = typeof configKeys;

export function normalizeMenuItems(items: MenuItem[]): ElementModel {
  return setIds(
    mapModels(
      ({ type, value }: MenuItem) => ({
        type,
        value: pick(value, configKeys as ConfigKeys)
      }),
      items
    )
  );
}

export function symbolsToItems(
  items: ElementModel[],
  symbols: Record<string, ElementModel>
): ElementModel[] {
  return items.map((item) =>
    produce(item, (draft) => {
      // @ts-expect-error: Need to specific model value
      Object.assign(draft.value, symbols[item.value.id]);

      // @ts-expect-error: Need to specific model value
      if (!draft.value.megaMenuItems) {
        const megaMenu = setIds({
          type: "SectionMegaMenu",
          value: { items: [] }
        });

        // @ts-expect-error: Need to specific model value
        draft.value.megaMenuItems = [megaMenu];
      }

      // @ts-expect-error: Need to specific model value
      draft.value.items = symbolsToItems(item.value.items ?? [], symbols);
    })
  );
}

export function itemsToSymbols(items: ElementModelType[]): ElementModel {
  return items.reduce((acc, item) => {
    return {
      ...acc,
      [item.value.id as string]: omit(item.value, [
        // megaMenuItems should stay
        ...configKeys.filter((k) => k !== "megaMenuItems"),
        "_id"
      ]),
      // @ts-expect-error: Object possible to be undefined
      ...(item.value.items?.length > 0 ? itemsToSymbols(item.value.items) : {})
    };
  }, {});
}
