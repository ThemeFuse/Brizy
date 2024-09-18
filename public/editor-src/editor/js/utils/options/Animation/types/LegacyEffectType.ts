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
  zoomInUp = "zoomInUp",

  brzWobbleHorizontal = "brz-wobble-horizontal",
  brzWobbleVertical = "brz-wobble-vertical",
  brzWobbleToBottomRight = "brz-wobble-to-bottom-right",
  brzWobbleToTopRight = "brz-wobble-to-top-right",
  brzWobbleTop = "brz-wobble-top",
  brzWobbleBottom = "brz-wobble-bottom",
  brzWobbleSkew = "brz-wobble-skew",

  brzPulse = "brz-pulse",
  brzPulseGrow = "brz-pulse-grow",
  brzPulseShrink = "brz-pulse-shrink",

  brzPush = "brz-push",
  brzPop = "brz-pop",

  brzBounceIn = "brz-bounce-in",
  brzBounceOut = "brz-bounce-out",

  brzGrow = "brz-grow",
  brzShrink = "brz-shrink",

  brzBob = "brz-bob",
  brzHang = "brz-hang",

  brzMoveUp = "brz-float",
  brzMoveDown = "brz-sink",
  brzMoveRight = "brz-forward",
  brzMoveLeft = "brz-backward",

  brzSkew = "brz-skew",
  brzSkewForward = "brz-skew-forward",
  brzSkewBackward = "brz-skew-backward",

  brzBuzz = "brz-buzz",
  brzBuzzOut = "brz-buzz-out",

  brzRotate = "brz-rotate",
  brzGrowRotate = "brz-grow-rotate",

  brzFade = "brz-fade",
  brzBackPulse = "brz-back-pulse",
  brzSweepToRight = "brz-sweep-to-right",
  brzSweepToLeft = "brz-sweep-to-left",
  brzSweepToBottom = "brz-sweep-to-bottom",
  brzSweepToTop = "brz-sweep-to-top",
  brzBounceToRight = "brz-bounce-to-right",
  brzBounceToLeft = "brz-bounce-to-left",
  brzBounceToBottom = "brz-bounce-to-bottom",
  brzBounceToTop = "brz-bounce-to-top",
  brzRadialOut = "brz-radial-out",
  brzRadialIn = "brz-radial-in",
  brzRectangleIn = "brz-rectangle-in",
  brzRectangleOut = "brz-rectangle-out",
  brzShutterInHorizontal = "brz-shutter-in-horizontal",
  brzShutterOutHorizontal = "brz-shutter-out-horizontal",
  brzShutterInVertical = "brz-shutter-in-vertical",
  brzShutterOutVertical = "brz-shutter-out-vertical"
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
