import { GlobalBlock } from "visual/types";
import { mPipe } from "visual/utils/fp";
import { Json, Obj, Str } from "@brizy/readers";

const reader = mPipe(Obj.readKey("data"), Str.read, Json.read);

export const parseGlobalBlocks = (
  globalBlocks: unknown
): Array<GlobalBlock> => {
  const _blocks = Array.isArray(globalBlocks);

  if (!_blocks) {
    return [];
  }

  return globalBlocks
    .map((b) => ({ ...b, data: reader(b) }))
    .filter((b) => b.data);
};
