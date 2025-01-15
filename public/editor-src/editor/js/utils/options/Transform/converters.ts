import { mPipe, optional, or, parseStrict, pass } from "fp-utilities";
import { Type } from "visual/component/Controls/Transform/types/Patch";
import { Value } from "visual/component/Controls/Transform/types/Value";
import { isActive } from "visual/component/Controls/Transform/utils";
import {
  FromElementModel,
  FromElementModelGetter,
  ToElementModel
} from "visual/component/Options/Type";
import { OptionPatch } from "visual/component/Options/types";
import { hasValue } from "visual/types/attributes";
import { always } from "visual/utils/fp";
import { callGetter } from "visual/utils/options/utils/wrap";
import { capByPrefix } from "visual/utils/string";
import {
  flattEffects,
  flattenObject,
  getEnabledEffects,
  getPatchType
} from "../utils/effects";
import { Effects } from "./types";
import * as AnchorPoint from "./types/AnchorPoint";
import * as Flip from "./types/Flip";
import * as Offset from "./types/Offset";
import * as Rotate from "./types/Rotate";
import * as Scale from "./types/Scale";
import * as Skew from "./types/Skew";
import { isEnabled, wrap } from "./utils";

export const defaultValue: Value = {
  active: undefined,
  rotate: undefined,
  offset: undefined,
  skew: undefined,
  scale: undefined,
  flip: undefined,
  anchorPoint: { x: "center", y: "center" }
};

export const fromElementModel: FromElementModel<"transform"> = parseStrict<
  FromElementModelGetter,
  Value
>({
  active: optional(mPipe(callGetter("active"), pass(isActive))),
  rotate: optional(
    mPipe(wrap("rotate"), pass(isEnabled), Rotate.fromElementModel)
  ),
  offset: optional(
    mPipe(wrap("offset"), pass(isEnabled), Offset.fromElementModel)
  ),
  skew: optional(mPipe(wrap("skew"), pass(isEnabled), Skew.fromElementModel)),
  scale: optional(
    mPipe(wrap("scale"), pass(isEnabled), Scale.fromElementModel)
  ),
  flip: optional(mPipe(wrap("flip"), pass(isEnabled), Flip.fromElementModel)),
  anchorPoint: or(
    mPipe(wrap("anchorPoint"), AnchorPoint.fromElementModel),
    always(defaultValue.anchorPoint)
  )
});

export const toElementModel: ToElementModel<"transform"> = (_patch) => {
  const value = hasValue(_patch) ? _patch.value : {};

  const patch = {
    ..._patch,
    type: getPatchType(_patch, Effects)
  } as OptionPatch<"transform">;

  if (!patch.type) {
    return {};
  }

  const flattenAnchor = flattenObject({
    anchorPoint: value
  });

  switch (patch.type) {
    case Type.multiple:
      return {
        active: patch.active,
        ...(patch.active
          ? { [capByPrefix(patch.active, "enabled")]: true }
          : {}),
        ...getEnabledEffects(patch),
        ...flattEffects(patch, Effects)
      };
    case Type.active:
      return {
        active: patch.active,
        ...(patch.active
          ? { [capByPrefix(patch.active, "enabled")]: true }
          : {})
      };
    case Type.enable:
      return {
        [capByPrefix(patch.effect, "enabled")]: value,
        ...(patch.active && !value ? { active: false } : {})
      };
    case Type.effect: {
      switch (patch.effect) {
        case "rotate":
          return "x" in value
            ? flattenAnchor
            : flattenObject({
                rotate: value
              });
        case "offset":
          return flattenObject({
            offset: value
          });
        case "skew":
          return flattenObject({
            skew: value
          });
        case "scale":
          return "x" in value
            ? flattenAnchor
            : flattenObject({
                scale: value
              });
        case "flip":
          return "x" in value
            ? flattenAnchor
            : flattenObject({
                flip: value
              });
        case "anchorPoint":
          return {
            anchorPoint: value
          };
      }
    }
  }
};
