import { mPipe, optional, orElse, parseStrict, pass } from "fp-utilities";
import {
  FromElementModel,
  FromElementModelGetter,
  ToElementModel
} from "visual/component/Options/Type";
import { OptionPatch } from "visual/component/Options/types";
import * as Unit from "visual/utils/math/Unit";
import { callGetter } from "visual/utils/options/utils/wrap";
import { capByPrefix } from "visual/utils/string";
import {
  Type,
  flattEffects,
  flattenObject,
  getEnabledEffects,
  getPatchType
} from "../utils/effects";
import { Effects } from "./types";
import * as Blur from "./types/Blur";
import * as Horizontal from "./types/Horizontal";
import * as MouseTilt from "./types/MouseTilt";
import * as Tilt from "./types/MouseTilt";
import * as MouseTrack from "./types/MouseTrack";
import { disableEffects } from "./types/Patch";
import * as Rotate from "./types/Rotate";
import * as Scale from "./types/Scale";
import * as Transparency from "./types/Transparency";
import { Value, isActive } from "./types/Value";
import * as Vertical from "./types/Vertical";
import * as Viewport from "./types/Viewport";
import { wrap } from "./types/utils";
import { isEnabled } from "./utils";

export const defaultValue: Value = {
  active: undefined,
  blur: {
    direction: "in",
    level: Unit.Min,
    viewport: Viewport.unsafe(Unit.Min, Unit.Max)
  },
  horizontal: {
    direction: "left",
    speed: Unit.Min,
    viewport: Viewport.unsafe(Unit.Min, Unit.Max)
  },
  mouseTrack: {
    direction: "direct",
    speed: Unit.Min
  },
  rotate: {
    direction: "left",
    speed: Unit.Min,
    x: "center",
    y: "center",
    viewport: Viewport.unsafe(Unit.Min, Unit.Max)
  },
  scale: {
    direction: "up",
    speed: -10,
    x: "center",
    y: "center",
    viewport: Viewport.unsafe(Unit.Min, Unit.Max)
  },
  mouseTilt: {
    direction: "direct",
    speed: Unit.Min
  },
  transparency: {
    direction: "in",
    level: Unit.Min,
    viewport: Viewport.unsafe(Unit.Min, Unit.Max)
  },
  vertical: {
    direction: "up",
    speed: Unit.Min,
    viewport: Viewport.unsafe(Unit.Min, Unit.Max)
  }
};

export const fromElementModel: FromElementModel<"motion"> = parseStrict<
  FromElementModelGetter,
  Value
>({
  active: optional(mPipe(callGetter("active"), pass(isActive))),
  vertical: optional(
    mPipe(
      wrap("vertical"),
      pass(isEnabled),
      Vertical.fromElementModel,
      orElse(defaultValue.vertical)
    )
  ),
  horizontal: optional(
    mPipe(
      wrap("horizontal"),
      pass(isEnabled),
      Horizontal.fromElementModel,
      orElse(defaultValue.horizontal)
    )
  ),
  transparency: optional(
    mPipe(
      wrap("transparency"),
      pass(isEnabled),
      Transparency.fromElementModel,
      orElse(defaultValue.transparency)
    )
  ),
  blur: optional(
    mPipe(
      wrap("blur"),
      pass(isEnabled),
      Blur.fromElementModel,
      orElse(defaultValue.blur)
    )
  ),
  rotate: optional(
    mPipe(
      wrap("rotate"),
      pass(isEnabled),
      Rotate.fromElementModel,
      orElse(defaultValue.rotate)
    )
  ),
  scale: optional(
    mPipe(
      wrap("scale"),
      pass(isEnabled),
      Scale.fromElementModel,
      orElse(defaultValue.scale)
    )
  ),
  mouseTrack: optional(
    mPipe(
      wrap("mouseTrack"),
      pass(isEnabled),
      MouseTrack.fromElementModel,
      orElse(defaultValue.mouseTrack)
    )
  ),
  mouseTilt: optional(
    mPipe(
      wrap("mouseTilt"),
      pass(isEnabled),
      MouseTilt.fromElementModel,
      orElse(defaultValue.mouseTilt)
    )
  )
});

export const toElementModel: ToElementModel<"motion"> = (_patch) => {
  const patch = {
    ..._patch,
    type: getPatchType(_patch, Effects)
  } as OptionPatch<"motion">;

  if (!patch.type) {
    return {};
  }

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
          : {}),
        ...(patch.active ? disableEffects(patch.active) : {})
      };
    case Type.enable:
      return {
        [capByPrefix(patch.effect, "enabled")]: patch.value,
        ...(patch.active && !patch.value ? { active: false } : {}),
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
