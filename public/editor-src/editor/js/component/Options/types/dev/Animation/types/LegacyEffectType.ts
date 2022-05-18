export enum LegacyEffectType {
  none = "none",
  bounce = "bounce",
  bounceIn = "bounceIn",
  bounceInDown = "bounceInDown",
  bounceInLeft = "bounceInLeft",
  bounceInRight = "bounceInRight",
  bounceInUp = "bounceInUp",
  fadeIn = "fadeIn",
  fadeInDown = "fadeInDown",
  fadeInDownBig = "fadeInDownBig",
  fadeInLeft = "fadeInLeft",
  fadeInLeftBig = "fadeInLeftBig",
  fadeInRight = "fadeInRight",
  fadeInRightBig = "fadeInRightBig",
  fadeInUp = "fadeInUp",
  fadeInUpBig = "fadeInUpBig",
  flash = "flash",
  jackInTheBox = "jackInTheBox",
  jello = "jello",
  lightSpeedIn = "lightSpeedIn",
  pulse = "pulse",
  rollIn = "rollIn",
  rotateIn = "rotateIn",
  rotateInDownLeft = "rotateInDownLeft",
  rotateInDownRight = "rotateInDownRight",
  rotateInUpLeft = "rotateInUpLeft",
  rotateInUpRight = "rotateInUpRight",
  rubberBand = "rubberBand",
  tada = "tada",
  shake = "shake",
  slideInUp = "slideInUp",
  slideInDown = "slideInDown",
  slideInLeft = "slideInLeft",
  slideInRight = "slideInRight",
  swing = "swing",
  wobble = "wobble",
  zoomIn = "zoomIn",
  zoomInDown = "zoomInDown",
  zoomInLeft = "zoomInLeft",
  zoomInRight = "zoomInRight",
  zoomInUp = "zoomInUp"
}

export const fromString = (v: string): LegacyEffectType | undefined =>
  Object.values(LegacyEffectType).includes(v as LegacyEffectType)
    ? (v as LegacyEffectType)
    : undefined;

export type LegacyFadeType =
  | LegacyEffectType.fadeIn
  | LegacyEffectType.fadeInUp
  | LegacyEffectType.fadeInUpBig
  | LegacyEffectType.fadeInDown
  | LegacyEffectType.fadeInDownBig
  | LegacyEffectType.fadeInLeft
  | LegacyEffectType.fadeInLeftBig
  | LegacyEffectType.fadeInRight
  | LegacyEffectType.fadeInRightBig;

export const fadeFromEffect = (
  v: LegacyEffectType
): LegacyFadeType | undefined => {
  switch (v) {
    case LegacyEffectType.fadeInDown:
    case LegacyEffectType.fadeIn:
    case LegacyEffectType.fadeInRight:
    case LegacyEffectType.fadeInUp:
    case LegacyEffectType.fadeInLeft:
    case LegacyEffectType.fadeInDownBig:
    case LegacyEffectType.fadeInRightBig:
    case LegacyEffectType.fadeInUpBig:
    case LegacyEffectType.fadeInLeftBig:
      return v;
    case LegacyEffectType.bounce:
    case LegacyEffectType.bounceIn:
    case LegacyEffectType.bounceInDown:
    case LegacyEffectType.bounceInLeft:
    case LegacyEffectType.bounceInRight:
    case LegacyEffectType.bounceInUp:
    case LegacyEffectType.flash:
    case LegacyEffectType.jackInTheBox:
    case LegacyEffectType.jello:
    case LegacyEffectType.none:
    case LegacyEffectType.pulse:
    case LegacyEffectType.rollIn:
    case LegacyEffectType.lightSpeedIn:
    case LegacyEffectType.rotateIn:
    case LegacyEffectType.rotateInDownLeft:
    case LegacyEffectType.rotateInDownRight:
    case LegacyEffectType.rotateInUpLeft:
    case LegacyEffectType.rotateInUpRight:
    case LegacyEffectType.rubberBand:
    case LegacyEffectType.slideInDown:
    case LegacyEffectType.slideInLeft:
    case LegacyEffectType.slideInRight:
    case LegacyEffectType.slideInUp:
    case LegacyEffectType.shake:
    case LegacyEffectType.swing:
    case LegacyEffectType.tada:
    case LegacyEffectType.wobble:
    case LegacyEffectType.zoomIn:
    case LegacyEffectType.zoomInDown:
    case LegacyEffectType.zoomInLeft:
    case LegacyEffectType.zoomInRight:
    case LegacyEffectType.zoomInUp:
      return undefined;
  }
};
