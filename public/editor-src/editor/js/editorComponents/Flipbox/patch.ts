import {
  readDirection,
  readTransition
} from "visual/editorComponents/Flipbox/utils";
import * as Obj from "visual/utils/reader/object";
import type { MValue } from "visual/utils/value";

export const onTransition = (v: Record<string, unknown>): MValue<boolean> => {
  if (Obj.read(v) && Obj.hasKey("transition", v)) {
    return !!readTransition(v.transition);
  }

  return undefined;
};

export const onDirection = (v: Record<string, unknown>): MValue<boolean> => {
  if (Obj.read(v) && Obj.hasKey("direction", v)) {
    return !!readDirection(v.direction);
  }

  return undefined;
};
