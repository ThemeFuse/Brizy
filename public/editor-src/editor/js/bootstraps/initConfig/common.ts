import { Base64 } from "js-base64";
import { PageCommon } from "visual/types";
import * as Json from "visual/utils/reader/json";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { MValue } from "visual/utils/value";

export const parsePageCommon = (page: unknown): PageCommon => {
  const _page = Obj.read(page);

  if (!_page) {
    throw new Error("Failed to parse page");
  }

  const pageData = Json.read(
    Base64.decode(Str.read(_page.data) ?? "")
  ) as MValue<PageCommon["data"]>;

  if (pageData) {
    return { ..._page, data: pageData } as PageCommon;
  }

  return { ..._page, data: { items: [] } as PageCommon["data"] } as PageCommon;
};
