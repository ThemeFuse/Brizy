import { Json, Obj, Str } from "@brizy/readers";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { mPipe } from "visual/utils/fp";

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
