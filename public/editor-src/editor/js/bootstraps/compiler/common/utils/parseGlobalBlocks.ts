import { GlobalBlock } from "visual/types";
import { mPipe } from "visual/utils/fp";
import * as Json from "visual/utils/reader/json";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";

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
