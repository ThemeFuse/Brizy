import { ElementModelType } from "visual/component/Elements/Types";
import { hasProps } from "visual/utils/object";
import { isNullish } from "visual/utils/value";

export const isModel = (obj: unknown): obj is ElementModelType => {
  if (isNullish(obj)) {
    return false;
  }

  return hasProps(["type", "value"], obj);
};
