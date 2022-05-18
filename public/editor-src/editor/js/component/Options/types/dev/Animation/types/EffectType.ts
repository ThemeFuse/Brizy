import { LegacyEffectType } from "./LegacyEffectType";
import { t } from "visual/utils/i18n";

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
  Attention2 = "attention2"
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
  }
};

export const isEffect = <T extends EffectType>(v: T) => (
  e: EffectType
): e is T => e === v;

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
  }
}
