import { produce } from "immer";
import { ElementModel } from "visual/component/Elements/Types";
import { Dictionary } from "visual/types/utils";
import { createFieldCollectionId } from "visual/utils/elements/posts";
import { Context } from "visual/utils/elements/posts/types";
import { Migration } from "visual/utils/migration";
import { objectFromEntries } from "visual/utils/object";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import * as NoEmptyString from "visual/utils/string/NoEmptyString";

interface V3 {
  symbols: Dictionary<string> | undefined;
}
type GetCollectionTypesInfoResult = Context["collectionTypesInfo"];

function removeUndefinedKeys(v: ElementModel): Record<string, unknown> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filtered = Object.entries(v).filter(([_, val]) => val !== undefined);

  return objectFromEntries(filtered);
}

function migrateSymbols(
  v: ElementModel,
  source: string,
  collection: GetCollectionTypesInfoResult
): V3["symbols"] {
  const symbols = v.symbols;

  if (Obj.isObject(symbols)) {
    const incBy = symbols[`${source}_incBy`];

    if (Str.is(incBy)) {
      let migrated = symbols as V3["symbols"];

      try {
        const incByItems: Array<string> = [];

        JSON.parse(incBy).forEach((id: string) => {
          const inc = `${source}_inc_${id}`;
          const incItems = symbols[inc];
          const fieldType = collection.refsById[source]?.find(
            (c) => c.id === id
          );

          if (fieldType?.fieldId) {
            incByItems.push(createFieldCollectionId(id, fieldType.fieldId));
          } else {
            incByItems.push(id);
          }

          if (Str.is(incItems) && fieldType?.fieldId) {
            try {
              const collectionItems = JSON.parse(incItems).map((id: string) => {
                return createFieldCollectionId(id, fieldType.fieldId);
              });

              migrated = produce(migrated, (draft) => {
                if (Obj.isObject(draft)) {
                  delete draft[inc];
                  const newInc = `${source}_inc_${createFieldCollectionId(
                    id,
                    fieldType.fieldId
                  )}`;
                  draft[newInc] = JSON.stringify(collectionItems);
                }
              });
            } catch (e) {
              if (process.env.NODE_ENV === "development") {
                console.log(e);
              }
            }
          }
        });

        if (incByItems.length) {
          migrated = produce<V3["symbols"]>(migrated, (draft) => {
            if (Obj.isObject(draft)) {
              draft[`${source}_incBy`] = JSON.stringify(incByItems);
            }
          });
        }
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.log(e);
        }
      }

      return migrated;
    }
  }

  return undefined;
}

export const m3: Migration<GetCollectionTypesInfoResult> = {
  version: 3,
  cb(v, collection) {
    if (!Obj.isObject(v)) {
      throw new Error(`Posts migration 3 input failed ${v}`);
    }

    let migrated: V3 | undefined = undefined;

    if (collection && Str.is(v.source) && NoEmptyString.is(v.source)) {
      migrated = {
        symbols: migrateSymbols(v, v.source, collection)
      };
    }

    return removeUndefinedKeys({ ...v, ...migrated });
  }
};
