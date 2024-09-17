import { getProLibs } from "visual/libs";
import {
  getDirection,
  getRendererType,
  getTriggerType,
  handleScroll
} from "./utils";
import {
  RendererType,
  TriggerType
} from "@brizy/component/src/Flex/Lottie/types";
import { Num, Str } from "@brizy/readers";
import { throttle } from "underscore";
import { getCurrentDevice } from "visual/utils/export";
import { DESKTOP } from "visual/utils/responsiveMode";

const observerCallbacks = new Map();

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const callback = observerCallbacks.get(entry.target);
      callback();
      observer.unobserve(entry.target);
    }
  });
});

export default function ($node: JQuery): void {
  const { Lottie } = getProLibs();

  if (!Lottie) {
    return;
  }

  const node = $node.get(0);

  if (!node) return;

  node.querySelectorAll(".brz-lottie-anim").forEach((node) => {
    const animationLink =
      Str.read(node.getAttribute("data-animate-name")) ?? "";
    const loopAttr = node.getAttribute("data-anim-loop");
    const loop = loopAttr === "true" || loopAttr === "on";
    const loadLazy = node.getAttribute("data-anim-load") === "true";
    const speed = Num.read(node.getAttribute("data-anim-speed")) ?? 1;
    const trigger =
      getTriggerType(node.getAttribute("data-anim-trigger")) ??
      TriggerType.OnLoad;
    const direction =
      getDirection(Num.read(node.getAttribute("data-anim-direction"))) ?? 1;

    const renderer =
      getRendererType(node.getAttribute("data-render-type")) ??
      RendererType.SVG;
    const autoplayAttr = node.getAttribute("data-anim-autoplay");
    const autoplay =
      (autoplayAttr === "true" || autoplayAttr === "on") &&
      trigger === TriggerType.OnLoad;

    const initializeAnimation = () => {
      const animation = Lottie.loadAnimation({
        container: node,
        loop,
        autoplay,
        path: animationLink,
        renderer,
        rendererSettings: {
          preserveAspectRatio:
            renderer === RendererType.SVG ? "xMidYMid slice" : "xMidYMid meet"
        }
      });

      animation.addEventListener("DOMLoaded", () => {
        if (trigger === TriggerType.OnScroll) {
          handleScroll(animation, node);
        }

        window.Brz.emit("elements.lottie.loaded", node);
      });

      if (trigger !== TriggerType.OnScroll) {
        animation.setSpeed(speed);
      }

      if (trigger === TriggerType.OnClick || trigger === TriggerType.OnLoad) {
        animation.setDirection(direction);
      }

      let isPlaying = false;
      animation.addEventListener("complete", () => {
        isPlaying = false;
      });

      const triggerHandler = () => {
        if (!isPlaying) {
          if (direction === -1 && !loop) {
            animation.goToAndStop(animation.totalFrames, true);
          } else {
            animation.goToAndStop(0, true);
          }

          animation.play();
          isPlaying = true;
        }
      };

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
            handleScroll(animation, node);
          }, 16);

          scrollableContainer.addEventListener("scroll", scrollHandler);
          break;
        }
      }
    };

    if (loadLazy) {
      observerCallbacks.set(node, initializeAnimation);
      observer.observe(node);
    } else initializeAnimation();
  });
}
