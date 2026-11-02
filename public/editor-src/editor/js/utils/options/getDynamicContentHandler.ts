import type { Handler } from "visual/component/Options/types/common/Population/types/Handler";
import type { DCGroup } from "visual/global/Config/types/DynamicContent";
import type { MValue } from "visual/utils/value";
import type { TypeChoices } from "./types";

export const getDynamicContentHandler = (
  options: DCGroup<"wp"> | DCGroup<"cloud">,
  type: TypeChoices
): MValue<Handler<string>> => {
  const item = options?.[type];

  if (!options || !item || Array.isArray(item)) {
    return undefined;
  }

  return (res, rej, extra) => {
    item.handler(
      (r) => {
        res(r.placeholder);
      },
      rej,
      extra
    );
  };
};
