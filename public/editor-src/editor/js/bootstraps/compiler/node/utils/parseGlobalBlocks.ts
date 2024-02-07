import { mPipe } from "fp-utilities";
import { GlobalBlock } from "visual/types";
import * as Arr from "visual/utils/reader/array";
import { parseGlobalBlock } from "visual/utils/reader/globalBlocks";
import * as Json from "visual/utils/reader/json";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";

interface BlockRecord {
  [key: string]: GlobalBlock;
}
const parseData = mPipe(Obj.readKey("data"), Str.read, Json.read);

export const parseGlobalBlocks = (globalBlocks: unknown): BlockRecord => {
  const blocks = Arr.read(globalBlocks);
  const output: BlockRecord = {};

  if (!blocks) {
    return {};
  }

  blocks.forEach((_block) => {
    const block = Obj.read(_block);

    if (!block) {
      return;
    }

    const data = parseData(block);

    if (!data) {
      return;
    }

    const globalBlock = parseGlobalBlock({ ...block, data });

    if (globalBlock) {
      const { status, meta, uid, data, dataVersion, rules, position } =
        globalBlock;
      switch (meta.type) {
        case "popup": {
          output[uid] = {
            uid,
            data,
            dataVersion,
            status,
            meta,
            rules,
            position
          };
          break;
        }
        case "normal": {
          output[uid] = {
            uid,
            data,
            dataVersion,
            status,
            meta,
            rules,
            position
          };
          break;
        }
      }
    }
  });

  return output;
};
