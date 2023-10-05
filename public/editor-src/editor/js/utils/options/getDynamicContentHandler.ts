import { Handler } from "visual/component/Options/types/common/Population/types/Handler";
import { DCGroup } from "visual/global/Config/types/DynamicContent";
import { MValue } from "visual/utils/value";
import { TypeChoices } from "./types";

export const getDynamicContentHandler = (
  options: DCGroup<"wp"> | DCGroup<"cloud">,
  type: TypeChoices
): MValue<Handler<string>> => {
  const item = options?.[type];

  if (!options || !item || Array.isArray(item)) {
    return undefined;
  }

  return (res, rej) => {
    item.handler((r) => {
      res(r.placeholder);
    }, rej);
  };
};
