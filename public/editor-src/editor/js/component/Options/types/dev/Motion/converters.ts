import { mPipe, optional, parseStrict, pass } from "fp-utilities";
import {
  FromElementModel,
  FromElementModelGetter,
  ToElementModel,
  callGetter
} from "visual/component/Options/Type";
import { capByPrefix } from "visual/utils/string";
import * as Blur from "./types/Blur";
import * as Horizontal from "./types/Horizontal";
import * as MouseTilt from "./types/MouseTilt";
import * as Tilt from "./types/MouseTilt";
import * as MouseTrack from "./types/MouseTrack";
import { Type, disableEffects } from "./types/Patch";
import * as Rotate from "./types/Rotate";
import * as Scale from "./types/Scale";
import * as Transparency from "./types/Transparency";
import { Value, isActive } from "./types/Value";
import * as Vertical from "./types/Vertical";
import { wrap } from "./types/utils";
import { flattenObject, isEnabled } from "./utils";

export const defaultValue: Value = {
  active: undefined,
  vertical: undefined,
  horizontal: undefined,
  blur: undefined,
  mouseTrack: undefined,
  rotate: undefined,
  scale: undefined,
  mouseTilt: undefined,
  transparency: undefined
};

export const fromElementModel: FromElementModel<"motion"> = parseStrict<
  FromElementModelGetter,
  Value
>({
  active: optional(mPipe(callGetter("active"), pass(isActive))),
  vertical: optional(
    mPipe(wrap("vertical"), pass(isEnabled), Vertical.fromElementModel)
  ),
  horizontal: optional(
    mPipe(wrap("horizontal"), pass(isEnabled), Horizontal.fromElementModel)
  ),
  transparency: optional(
    mPipe(wrap("transparency"), pass(isEnabled), Transparency.fromElementModel)
  ),
  blur: optional(mPipe(wrap("blur"), pass(isEnabled), Blur.fromElementModel)),
  rotate: optional(
    mPipe(wrap("rotate"), pass(isEnabled), Rotate.fromElementModel)
  ),
  scale: optional(
    mPipe(wrap("scale"), pass(isEnabled), Scale.fromElementModel)
  ),
  mouseTrack: optional(
    mPipe(wrap("mouseTrack"), pass(isEnabled), MouseTrack.fromElementModel)
  ),
  mouseTilt: optional(
    mPipe(wrap("mouseTilt"), pass(isEnabled), MouseTilt.fromElementModel)
  )
});

export const toElementModel: ToElementModel<"motion"> = (patch) => {
  switch (patch.type) {
    case Type.active:
      return {
        active: patch.active,
        ...(patch.active
          ? { [capByPrefix(patch.active, "enabled")]: true }
          : {}),
        ...(patch.active ? disableEffects(patch.active) : {})
      };
    case Type.enable:
      return {
        [capByPrefix(patch.effect, "enabled")]: patch.value,
        ...(patch.active && !patch.value ? { active: undefined } : {}),
        ...disableEffects(patch.effect)
      };
    case Type.effect: {
      switch (patch.effect) {
        case "vertical":
          return flattenObject({
            vertical: Vertical.toElementModel(patch.value as Vertical.Vertical)
          });
        case "horizontal":
          return flattenObject({
            horizontal: Horizontal.toElementModel(
              patch.value as Horizontal.Horizontal
            )
          });
        case "transparency":
          return flattenObject({
            transparency: Transparency.toElementModel(
              patch.value as Transparency.Transparency
            )
          });
        case "blur":
          return flattenObject({
            blur: Blur.toElementModel(patch.value as Blur.Blur)
          });
        case "rotate":
          return flattenObject({
            rotate: Rotate.toElementModel(patch.value as Rotate.Rotate)
          });
        case "scale":
          return flattenObject({
            scale: Scale.toElementModel(patch.value as Scale.Scale)
          });
        case "mouseTrack":
          return flattenObject({
            mouseTrack: MouseTrack.toElementModel(
              patch.value as MouseTrack.MouseTrack
            )
          });
        case "mouseTilt":
          return flattenObject({
            mouseTilt: Tilt.toElementModel(patch.value as Tilt.MouseTilt)
          });
      }
    }
  }
};
