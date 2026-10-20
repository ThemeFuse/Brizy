import { Arr, Json, Obj, Str } from "@brizy/readers";
import type { GlobalBlock } from "visual/types/GlobalBlock";
import { mPipe } from "visual/utils/fp";
import {
  convertGlobalBlockRule,
  type ExternalTypesByCollectionType
} from "./globalBlockRules";

const dataReader = mPipe(Obj.readKey("data"), Str.read, Json.read);
const rulesReader = mPipe(Obj.readKey("rules"), Arr.read);

export const parseGlobalBlocks = (
  globalBlocks: unknown,
  externalTypes: ExternalTypesByCollectionType
): Array<GlobalBlock> => {
  const _blocks = Array.isArray(globalBlocks);

  if (!_blocks) {
    return [];
  }

  return globalBlocks
    .map((b) => {
      const rules = rulesReader(b);

      return {
        ...b,
        data: dataReader(b),
        // Rules that are not an array are left exactly as they came.
        ...(rules
          ? {
              rules: rules.map((rule) =>
                convertGlobalBlockRule(rule, externalTypes)
              )
            }
          : {})
      };
    })
    .filter((b) => b.data);
};
