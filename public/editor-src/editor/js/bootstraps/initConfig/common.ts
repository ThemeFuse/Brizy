import { Base64 } from "js-base64";
import { GlobalBlock, PageCommon } from "visual/types";
import { mPipe } from "visual/utils/fp";
import * as Json from "visual/utils/reader/json";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";

const reader = mPipe(Obj.readKey("data"), Str.read, Base64.decode, Json.read);

export const parsePageCommon = (page: unknown): PageCommon => {
  const _page = Obj.read(page);

  if (!_page) {
    throw new Error("Failed to parse page");
  }

  const pageData = reader(_page);

  if (pageData) {
    return { ..._page, data: pageData } as PageCommon;
  }

  return { ..._page, data: { items: [] } as PageCommon["data"] } as PageCommon;
};

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
