import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { getCustomIcons as getCustomIconsApi } from "visual/utils/api";
import { toArray } from "visual/utils/array";
import { mPipe } from "visual/utils/fp";
import { read as readObj } from "visual/utils/reader/object";
import { isT } from "visual/utils/value";
import { CustomIcon, Icon, read, readCustom } from "./Icon";
import { TypeId } from "./Type";

const readIcons = (m: { default: unknown[] }): Icon[] => {
  return toArray(m?.default).map(read).filter(isT) as Icon[];
};

const readCustomIcons = (value: unknown): CustomIcon[] => {
  return toArray(value).map(mPipe(readObj, readCustom)).filter(isT);
};

export const getTypeIcons = (
  type: TypeId,
  config: ConfigCommon
): Promise<Icon[] | CustomIcon[]> => {
  switch (type) {
    case TypeId.Outline:
      return import("./iconTypes/outline.json").then(readIcons);
    case TypeId.Glyph:
      return import("./iconTypes/glyph.json").then(readIcons);
    case TypeId.Fa:
      return import("./iconTypes/fa.json").then(readIcons);
    case TypeId.Custom:
      return getCustomIconsApi(config).then(readCustomIcons);
  }
};
