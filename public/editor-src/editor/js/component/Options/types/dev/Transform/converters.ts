import { mPipe, optional, parseStrict, pass } from "fp-utilities";
import {
  FromElementModel,
  FromElementModelGetter,
  ToElementModel,
  callGetter
} from "visual/component/Options/Type";
import { capByPrefix } from "visual/utils/string";
import { Type } from "./types/Patch";
import * as Rotate from "./types/Rotate";
import { Value, isActive } from "./types/Value";
import { wrap } from "./types/utils";
import { flattenObject, isEnabled } from "./utils";

export const defaultValue: Value = {
  active: undefined,
  rotate: undefined
};

export const fromElementModel: FromElementModel<"transform"> = parseStrict<
  FromElementModelGetter,
  Value
>({
  active: optional(mPipe(callGetter("active"), pass(isActive))),
  rotate: optional(
    mPipe(wrap("rotate"), pass(isEnabled), Rotate.fromElementModel)
  )
});

export const toElementModel: ToElementModel<"transform"> = (patch) => {
  switch (patch.type) {
    case Type.active:
      return {
        active: patch.active,
        ...(patch.active
          ? { [capByPrefix(patch.active, "enabled")]: true }
          : {})
      };
    case Type.enable:
      return {
        [capByPrefix(patch.effect, "enabled")]: patch.value,
        ...(patch.active && !patch.value ? { active: undefined } : {})
      };
    case Type.effect: {
      switch (patch.effect) {
        case "rotate":
          return flattenObject({
            rotate: Rotate.toElementModel(patch.value as Rotate.Rotate)
          });
      }
    }
  }
};
