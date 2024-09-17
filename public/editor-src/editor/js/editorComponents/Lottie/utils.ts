import { checkValue, checkValue2 } from "visual/utils/checkValue";
import { BoxResizerParams } from "./type";
import {
  RendererType,
  TriggerType
} from "@brizy/component/src/Flex/Lottie/types";
import { AnimationDirection, AnimationItem } from "lottie-web";

export const resizerPoints = [
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight"
];

export const getBoxResizerParams: BoxResizerParams = () => ({
  points: resizerPoints,
  restrictions: {
    width: {
      px: { min: 5, max: 1000 },
      "%": { min: 5, max: 100 }
    },
    // Tablet
    tabletWidth: {
      px: { min: 5, max: 1000 },
      "%": { min: 5, max: 100 }
    },
    // Mobile
    mobileWidth: {
      px: { min: 5, max: 1000 },
      "%": { min: 5, max: 100 }
    }
  }
});

export const getTriggerType = checkValue2<TriggerType>(TriggerType);
export const getRendererType = checkValue2<RendererType>(RendererType);
export const getDirection = checkValue<AnimationDirection>([1, -1]);

export function getContainerVisibility(container: Element): number {
  const { top, height } = container.getBoundingClientRect();
  const { innerHeight } = window;

  const current = innerHeight - top;
  const max = innerHeight + height;
  return current / max;
}

export const handleScroll = (animation: AnimationItem, node: Element): void => {
  const currentPercent = getContainerVisibility(node);
  const frameToGo = Math.ceil(currentPercent * animation.totalFrames);

  animation.goToAndStop(frameToGo, true);
};
