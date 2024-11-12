import {
  RendererType,
  TriggerType
} from "@brizy/component/src/Flex/Lottie/types";
import { Num, pipe } from "@brizy/readers";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import { checkValue, checkValue2 } from "visual/utils/checkValue";
import { BoxResizerParams } from "./type";
import { AnimationDirection, AnimationItem } from "lottie-web";
import { getCurrentDevice } from "visual/utils/export";
import { DESKTOP } from "visual/utils/responsiveMode";
import { throttle } from "underscore";

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
export const getDirection = pipe(
  Num.read,
  checkValue<AnimationDirection>([1, -1])
);

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

export const handleScrollDotLottie = (
  animation: DotLottie,
  node: Element
): void => {
  const currentPercent = getContainerVisibility(node);
  const frameToGo = Math.ceil(currentPercent * animation.totalFrames);

  animation.setFrame(frameToGo);
  animation.stop();
};

/**
 * We check for both `.lottie` and `.zip` extensions because `.lottie` files
 * are essentially ZIP archives that bundle all necessary assets (JSON, images, etc.).
 */
export const isLottieFile = (fileName: string): boolean =>
  /\.(lottie|zip)$/i.test(fileName);

export const createTriggerHandler = (
  trigger: TriggerType,
  node: HTMLElement,
  triggerHandler: VoidFunction,
  handleScroll: VoidFunction
) => {
  switch (trigger) {
    case TriggerType.OnClick: {
      node.addEventListener("click", triggerHandler);
      break;
    }
    case TriggerType.OnHover: {
      const isDesktopMode = getCurrentDevice() === DESKTOP;
      if (isDesktopMode) {
        node.addEventListener("mouseenter", triggerHandler);
      } else {
        node.addEventListener("click", triggerHandler);
      }
      break;
    }
    case TriggerType.OnScroll: {
      const scrollableContainer =
        node.closest(".brz-popup2__inner") || document;

      const scrollHandler = throttle(() => {
        handleScroll();
      }, 16);
      scrollableContainer.addEventListener("scroll", scrollHandler);
      break;
    }
  }
};

export const attachScrollHandler = (
  trigger: TriggerType,
  node: HTMLElement,
  handleScroll: VoidFunction
) => {
  if (trigger === TriggerType.OnScroll) {
    handleScroll();

    window.Brz.emit("elements.lottie.loaded", node);
  }
};
