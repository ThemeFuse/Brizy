import type {
  RendererType,
  TriggerType
} from "@brizy/component/src/Flex/Lottie/types";
import type { AnimationDirection } from "lottie-web";
import type { ElementModel } from "visual/component/Elements/Types";
import type { Type } from "visual/component/Link/types/Type";

type Switch = "on" | "off";

export interface Value extends ElementModel {
  animationFile: string;
  animationLink: string;

  loop: Switch;
  isLoop: Switch;
  autoplay: Switch;
  isAutoplay: Switch;
  lazyLoad: Switch;

  speed: number;

  trigger: TriggerType;
  renderer: RendererType;
  direction: AnimationDirection;

  bgColorHex: string;
  bgColorPalette: string;
  bgColorOpacity: number;

  linkPopup: string;
  linkLightBox: string;
  linkType: Type;
}

export interface Meta {
  [k: string]: unknown;
  patch: {
    animationFile: string;
    animationLink: string;
  };
}

export interface State {
  animation: string;
  previousLink: string;
}
