import { t } from "visual/utils/i18n";
import { LegacyEffectType } from "./LegacyEffectType";

export enum EffectType {
  None = "none",
  Bounce = "bounce",
  Fade = "fade",
  Fade2 = "fade2",
  Rotate = "rotate",
  Slide = "slide",
  Zoom = "zoom",
  Zoom2 = "zoom2",
  Attention = "attention",
  Attention2 = "attention2",
  Pulse = "pulse",
  Wobble = "wobble",
  Buzz = "buzz",
  Scale = "scale",
  Skew = "skew",
  Move = "move",
  Rotate2 = "rotate2"
}

export const fromLegacyEffectType = (v: LegacyEffectType): EffectType => {
  switch (v) {
    case LegacyEffectType.bounce:
    case LegacyEffectType.bounceIn:
    case LegacyEffectType.bounceInDown:
    case LegacyEffectType.bounceInLeft:
    case LegacyEffectType.bounceInRight:
    case LegacyEffectType.bounceInUp: {
      return EffectType.Bounce;
    }
    case LegacyEffectType.fadeIn:
    case LegacyEffectType.fadeInDown:
    case LegacyEffectType.fadeInDownBig:
    case LegacyEffectType.fadeInLeft:
    case LegacyEffectType.fadeInLeftBig:
    case LegacyEffectType.fadeInRight:
    case LegacyEffectType.fadeInRightBig:
    case LegacyEffectType.fadeInUp:
    case LegacyEffectType.fadeInUpBig: {
      return EffectType.Fade;
    }
    case LegacyEffectType.none: {
      return EffectType.None;
    }
    case LegacyEffectType.rotateIn:
    case LegacyEffectType.rotateInDownLeft:
    case LegacyEffectType.rotateInDownRight:
    case LegacyEffectType.rotateInUpLeft:
    case LegacyEffectType.rotateInUpRight: {
      return EffectType.Rotate;
    }
    case LegacyEffectType.slideInDown:
    case LegacyEffectType.slideInLeft:
    case LegacyEffectType.slideInRight:
    case LegacyEffectType.slideInUp: {
      return EffectType.Slide;
    }
    case LegacyEffectType.zoomIn:
    case LegacyEffectType.zoomInDown:
    case LegacyEffectType.zoomInLeft:
    case LegacyEffectType.zoomInRight:
    case LegacyEffectType.zoomInUp: {
      return EffectType.Zoom;
    }
    case LegacyEffectType.flash:
    case LegacyEffectType.jackInTheBox:
    case LegacyEffectType.jello:
    case LegacyEffectType.lightSpeedIn:
    case LegacyEffectType.pulse:
    case LegacyEffectType.rollIn:
    case LegacyEffectType.rubberBand:
    case LegacyEffectType.shake:
    case LegacyEffectType.swing:
    case LegacyEffectType.tada:
    case LegacyEffectType.wobble: {
      return EffectType.Attention;
    }
    case LegacyEffectType.brzPulse:
    case LegacyEffectType.brzPulseGrow:
    case LegacyEffectType.brzPulseShrink: {
      return EffectType.Pulse;
    }
    case LegacyEffectType.brzWobbleHorizontal:
    case LegacyEffectType.brzWobbleVertical:
    case LegacyEffectType.brzWobbleToBottomRight:
    case LegacyEffectType.brzWobbleToTopRight:
    case LegacyEffectType.brzWobbleTop:
    case LegacyEffectType.brzWobbleBottom:
    case LegacyEffectType.brzWobbleSkew: {
      return EffectType.Wobble;
    }
    case LegacyEffectType.brzBuzz:
    case LegacyEffectType.brzBuzzOut: {
      return EffectType.Buzz;
    }
    case LegacyEffectType.brzPop:
    case LegacyEffectType.brzPush:
    case LegacyEffectType.brzBounceIn:
    case LegacyEffectType.brzBounceOut:
    case LegacyEffectType.brzGrow:
    case LegacyEffectType.brzShrink: {
      return EffectType.Scale;
    }
    case LegacyEffectType.brzSkew:
    case LegacyEffectType.brzSkewForward:
    case LegacyEffectType.brzSkewBackward: {
      return EffectType.Skew;
    }
    case LegacyEffectType.brzMoveDown:
    case LegacyEffectType.brzMoveUp:
    case LegacyEffectType.brzMoveRight:
    case LegacyEffectType.brzMoveLeft:
    case LegacyEffectType.brzBob:
    case LegacyEffectType.brzHang: {
      return EffectType.Move;
    }
    case LegacyEffectType.brzRotate:
    case LegacyEffectType.brzGrowRotate: {
      return EffectType.Rotate2;
    }
  }
};

export const isEffect =
  <T extends EffectType>(v: T) =>
  (e: EffectType): e is T =>
    e === v;

export const effectTypeIcon = (t: EffectType): string => {
  switch (t) {
    case EffectType.Attention:
    case EffectType.Attention2: {
      return "nc-warning";
    }
    case EffectType.None: {
      return "nc-none";
    }
    case EffectType.Bounce: {
      return "nc-bounce";
    }
    case EffectType.Fade:
    case EffectType.Fade2: {
      return "nc-fade";
    }
    case EffectType.Rotate: {
      return "nc-captcha";
    }
    case EffectType.Slide: {
      return "nc-slider-horizontal";
    }
    case EffectType.Zoom:
    case EffectType.Zoom2: {
      return "nc-search";
    }
    case EffectType.Pulse: {
      return "nc-hover-pulse";
    }
    case EffectType.Wobble: {
      return "nc-hover-wobble";
    }
    case EffectType.Buzz: {
      return "nc-hover-buzz";
    }
    case EffectType.Scale: {
      return "nc-scroll-scale";
    }
    case EffectType.Skew: {
      return "nc-hover-skew";
    }
    case EffectType.Move: {
      return "nc-hover-move";
    }
    case EffectType.Rotate2: {
      return "nc-hover-rotate";
    }
  }
};

export function effectTypeTitle(type: EffectType): string {
  switch (type) {
    case EffectType.Attention:
    case EffectType.Attention2: {
      return t("Attention");
    }
    case EffectType.None: {
      return t("None");
    }
    case EffectType.Bounce: {
      return t("Bounce");
    }
    case EffectType.Fade:
    case EffectType.Fade2: {
      return t("Fade");
    }
    case EffectType.Rotate: {
      return t("Rotate");
    }
    case EffectType.Slide: {
      return t("Slide");
    }
    case EffectType.Zoom:
    case EffectType.Zoom2: {
      return t("Zoom");
    }
    case EffectType.Pulse: {
      return t("Pulse");
    }
    case EffectType.Wobble: {
      return t("Wobble");
    }
    case EffectType.Buzz: {
      return t("Buzz");
    }
    case EffectType.Scale: {
      return t("Scale");
    }
    case EffectType.Skew: {
      return t("Skew");
    }
    case EffectType.Move: {
      return t("Move");
    }
    case EffectType.Rotate2: {
      return t("Rotate");
    }
  }
}
