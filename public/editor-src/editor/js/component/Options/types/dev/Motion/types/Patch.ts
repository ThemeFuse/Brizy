import { Effect, EffectValue } from "./Value";
import { ElementModel } from "visual/component/Elements/Types";
import { flattenObject } from "visual/component/Options/types/dev/Motion/utils";
import * as Vertical from "visual/component/Options/types/dev/Motion/types/Vertical";
import * as Horizontal from "visual/component/Options/types/dev/Motion/types/Horizontal";
import * as Transparency from "visual/component/Options/types/dev/Motion/types/Transparency";
import * as Blur from "visual/component/Options/types/dev/Motion/types/Blur";
import * as Rotate from "visual/component/Options/types/dev/Motion/types/Rotate";
import * as Scale from "visual/component/Options/types/dev/Motion/types/Scale";
import * as MouseTrack from "visual/component/Options/types/dev/Motion/types/MouseTrack";
import * as Tilt from "visual/component/Options/types/dev/Motion/types/MouseTilt";
import { capByPrefix } from "visual/utils/string";

enum Type {
  active = "active",
  enable = "enable",
  effect = "effect"
}

export type Active = {
  type: Type.active;
  active: Effect | undefined;
};

export const active = (active: Effect | undefined): Active => ({
  type: Type.active,
  active
});

export type Enable = {
  type: Type.enable;
  effect: Effect;
  value: boolean;
  active: boolean;
};

export const enable = (
  effect: Effect,
  value: boolean,
  active: boolean
): Enable => ({
  type: Type.enable,
  effect,
  value,
  active
});

export type Eff<E extends Effect> = {
  type: Type.effect;
  effect: E;
  value: EffectValue<E>;
};

export const eff = <E extends Effect>(
  effect: E,
  value: EffectValue<E>
): Eff<E> => ({
  type: Type.effect,
  effect,
  value
});

export type Patch = Active | Enable | Eff<Effect>;

export const isMouseEffect = (e: Effect): e is "mouseTrack" | "mouseTilt" =>
  e === "mouseTilt" || e === "mouseTrack";

export const disableEffects = (e: Effect): ElementModel => {
  return isMouseEffect(e)
    ? {
        verticalEnabled: false,
        horizontalEnabled: false,
        transparencyEnabled: false,
        blurEnabled: false,
        rotateEnabled: false,
        scaleEnabled: false
      }
    : {
        mouseTrackEnabled: false,
        mouseTiltEnabled: false
      };
};

export const toElementModel = (patch: Patch): ElementModel => {
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
