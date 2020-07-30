import { t } from "visual/utils/i18n";

export const getAnimations = () => [
  { value: "none", title: t("None") },
  { value: "bounce", title: t("Bounce") },
  { value: "flash", title: t("Flash") },
  { value: "pulse", title: t("Pulse") },
  { value: "rubberBand", title: t("RubberBand") },
  { value: "shake", title: t("Shake") },
  { value: "swing", title: t("Swing") },
  { value: "tada", title: t("Tada") },
  { value: "wobble", title: t("Wobble") },
  { value: "jello", title: t("Jello") },

  // Bouncing Entrances
  { value: "bounceIn", title: t("BounceIn") },
  { value: "bounceInDown", title: t("BounceInDown") },
  { value: "bounceInLeft", title: t("BounceInLeft") },
  { value: "bounceInRight", title: t("BounceInRight") },
  { value: "bounceInUp", title: t("BounceInUp") },

  // Bouncing Exits
  // { value: "bounceOut", title: t("BounceOut") },
  // { value: "bounceOutDown", title: t("BounceOutDown") },
  // { value: "bounceOutLeft", title: t("BounceOutLeft") },
  // { value: "bounceOutRight", title: t("BounceOutRight") },
  // { value: "bounceOutUp", title: t("BounceOutUp") },

  // Fading Entrances
  { value: "fadeIn", title: t("FadeIn") },
  { value: "fadeInDown", title: t("FadeInDown") },
  { value: "fadeInDownBig", title: t("FadeInDownBig") },
  { value: "fadeInLeft", title: t("FadeInLeft") },
  { value: "fadeInLeftBig", title: t("FadeInLeftBig") },
  { value: "fadeInRight", title: t("FadeInRight") },
  { value: "fadeInRightBig", title: t("FadeInRightBig") },
  { value: "fadeInUp", title: t("FadeInUp") },
  { value: "fadeInUpBig", title: t("FadeInUpBig") },

  // Fading Exits
  // { value: "fadeOut", title: t("FadeOut") },
  // { value: "fadeOutDown", title: t("FadeOutDown") },
  // { value: "fadeOutDownBig", title: t("FadeOutDownBig") },
  // { value: "fadeOutLeft", title: t("FadeOutLeft") },
  // { value: "fadeOutLeftBig", title: t("FadeOutLeftBig") },
  // { value: "fadeOutRight", title: t("FadeOutRight") },
  // { value: "fadeOutRightBig", title: t("FadeOutRightBig") },
  // { value: "fadeOutUp", title: t("FadeOutUp") },
  // { value: "fadeOutUpBig", title: t("FadeOutUpBig") },

  // Flippers Entrances
  { value: "flip", title: t("Flip") },
  { value: "flipInX", title: t("FlipInX") },
  { value: "flipInY", title: t("FlipInY") },

  // Flippers Exits
  // { value: "flipOutX", title: t("FlipOutX") },
  // { value: "flipOutY", title: t("FlipOutY") },

  // Lighting Entrances
  { value: "lightSpeedIn", title: t("LightSpeedIn") },

  // Lighting Exits
  // { value: "lightSpeedOut", title: "LightSpeedOut" },

  // Rotating Entrances
  { value: "rotateIn", title: t("RotateIn") },
  { value: "rotateInDownLeft", title: t("RotateInDownLeft") },
  { value: "rotateInDownRight", title: t("RotateInDownRight") },
  { value: "rotateInUpLeft", title: t("RotateInUpLeft") },
  { value: "rotateInUpRight", title: t("RotateInUpRight") },

  // Rotating Exits
  // { value: "rotateOut", title: t("RotateOut") },
  // { value: "rotateOutDownLeft", title: t("RotateOutDownLeft") },
  // { value: "rotateOutDownRight", title: t("RotateOutDownRight") },
  // { value: "rotateOutUpLeft", title: t("RotateOutUpLeft") },
  // { value: "rotateOutUpRight", title: t("RotateOutUpRight") },

  // Sliding Entrances
  { value: "slideInUp", title: t("SlideInUp") },
  { value: "slideInDown", title: t("SlideInDown") },
  { value: "slideInLeft", title: t("SlideInLeft") },
  { value: "slideInRight", title: t("SlideInRight") },

  // Sliding Exits
  // { value: "slideOutUp", title: t("SlideOutUp") },
  // { value: "slideOutDown", title: t("SlideOutDown") },
  // { value: "slideOutLeft", title: t("SlideOutLeft") },
  // { value: "slideOutRight", title: t("SlideOutRight") },

  // Zooming Entrances
  { value: "zoomIn", title: t("ZoomIn") },
  { value: "zoomInDown", title: t("ZoomInDown") },
  { value: "zoomInLeft", title: t("ZoomInLeft") },
  { value: "zoomInRight", title: t("ZoomInRight") },
  { value: "zoomInUp", title: t("ZoomInUp") },

  // Zooming Exits
  // { value: "zoomOut", title: t("ZoomOut") },
  // { value: "zoomOutDown", title: t("ZoomOutDown") },
  // { value: "zoomOutLeft", title: t("ZoomOutLeft") },
  // { value: "zoomOutRight", title: t("ZoomOutRight") },
  // { value: "zoomOutUp", title: t("ZoomOutUp") },

  // { value: "hinge", title: t("Hinge") },
  { value: "jackInTheBox", title: t("JackInTheBox") },

  // Rolling Entrances
  { value: "rollIn", title: t("RollIn") }

  // Rolling Exits
  // { value: "rollOut", title: t("RollOut") }
];

export const getAnimationsTabs = () => [
  { value: "none", title: t("None") },
  { value: "flash", title: t("Flash") },
  { value: "pulse", title: t("Pulse") },

  // Fading Entrances
  { value: "fadeIn", title: t("FadeIn") },
  { value: "fadeInDown", title: t("FadeInDown") },
  { value: "fadeInLeft", title: t("FadeInLeft") },
  { value: "fadeInRight", title: t("FadeInRight") },
  { value: "fadeInUp", title: t("FadeInUp") },

  // Zooming Entrances
  { value: "zoomIn", title: t("ZoomIn") }
];
