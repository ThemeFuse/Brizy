import type { Image } from "visual/component/Options/types/dev/Gallery/types/Image";
import { KenEffect, Transition } from "../../type";

export interface Props {
  images: Image[];
  slideshowLoop?: string;
  slideshowDuration?: number;
  slideshowTransitionType?: Transition;
  slideshowTransition?: number;
  kenBurnsEffect?: KenEffect;
}
