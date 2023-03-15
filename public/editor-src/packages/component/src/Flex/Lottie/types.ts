import { AnimationDirection } from "lottie-web";

export interface Props {
  isLoop?: boolean;
  isAutoplay?: boolean;
  animationData: string;
  speed?: number;
  direction?: AnimationDirection;
  renderer: "svg" | "canvas" | "html";
}
