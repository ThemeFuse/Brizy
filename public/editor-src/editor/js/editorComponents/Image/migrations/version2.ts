import { mPipe } from "fp-utilities";
import { ElementModel } from "visual/component/Elements/Types";
import { SizeType } from "visual/global/Config/types/configs/common";
import { Dictionary } from "visual/types/utils";
import * as Obj from "visual/utils/reader/object";
import { read } from "visual/utils/reader/string";
import { MValue } from "visual/utils/value";
import { MigrationImage } from "./types";

interface DCPlaceholderObj {
  name: string;
  attr?: Dictionary<unknown>;
}

// The old version of explodePlaceholder
const _unescape = mPipe(read, unescape);
export function placeholderObjFromStr(
  placeholder: string
): MValue<DCPlaceholderObj> {
  const r1 = /^{{\s*([\w-]+)(.*?)\s*}}$/;
  const nameAndAttr = r1.exec(placeholder);

  if (!nameAndAttr) {
    return undefined;
  }

  const [, name, attrStr] = nameAndAttr;

  if (attrStr === "") {
    return { name };
  }

  const r2 = /(\w+)=("|'|&quot;|&apos;)(.*?)\2/g;
  let attr: Dictionary<string> | undefined = undefined;
  let match;

  while ((match = r2.exec(attrStr.trim()))) {
    attr = attr ?? {};
    attr[match[1]] = _unescape(match[3]);
  }

  return attr ? { name, attr } : { name };
}

const correction = (v: ElementModel): ElementModel => {
  const imagePopulation = read(v.imagePopulation);

  if (!imagePopulation) {
    return {};
  }

  const placeholderData = placeholderObjFromStr(imagePopulation);

  if (placeholderData?.attr?.size !== undefined) {
    const size = read(placeholderData.attr.size) ?? SizeType.custom;

    return {
      sizeType: size.trim().length > 0 ? size : SizeType.custom
    };
  }

  return { sizeType: SizeType.custom };
};

export const m2: MigrationImage = {
  version: 2,
  cb({ v }) {
    if (!Obj.isObject(v)) {
      throw new Error(`Image migration failed ${v}`);
    }

    return correction(v);
  }
};
