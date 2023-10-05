import { ElementModelType } from "visual/component/Elements/Types";
import { hasProps } from "visual/utils/object";
import { isNullish } from "visual/utils/value";

export const isModel = (obj: unknown): obj is ElementModelType => {
  if (isNullish(obj)) {
    return false;
  }

  // @ts-expect-error: Need transform to ts /utils/object
  return hasProps(["type", "value"], obj);
};
