import { getProLibs } from "visual/libs";
import {
  attachScrollHandler,
  createTriggerHandler,
  getDirection,
  getRendererType,
  getTriggerType,
  handleScroll,
  handleScrollDotLottie
} from "./utils";
import {
  RendererType,
  TriggerType
} from "@brizy/component/src/Flex/Lottie/types";
import { Num, Str } from "@brizy/readers";

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
  const { Lottie, DotLottie } = getProLibs();

  if (!Lottie || !DotLottie) {
    return;
  }

  const node = $node.get(0);

  if (!node) return;

  node.querySelectorAll<HTMLElement>(".brz-lottie-anim").forEach((node) => {
    const {
      animateName,
      animLoop,
      animLoad,
      animSpeed,
      animTrigger,
      animDirection,
      renderType,
      animAutoplay,
      lottieFile
    } = node.dataset;

    const animationLink = Str.read(animateName) ?? "";
    const loadLazy = animLoad === "true";
    const speed = Num.read(animSpeed) ?? 1;
    const trigger = getTriggerType(animTrigger) ?? TriggerType.OnLoad;
    const direction = getDirection(Num.read(animDirection)) ?? 1;
    const isLottieFile = lottieFile === "true";
    const loop = animLoop === "true" || animLoop === "on";

    const renderer = getRendererType(renderType) ?? RendererType.SVG;
    const autoplay =
      (animAutoplay === "true" || animAutoplay === "on") &&
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

      const handleLottieScroll = () => handleScroll(animation, node);

      animation.addEventListener("DOMLoaded", () =>
        attachScrollHandler(trigger, node, handleLottieScroll)
      );

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

      createTriggerHandler(trigger, node, triggerHandler, () =>
        handleScroll(animation, node)
      );
    };

    const initializeDotLottieAnimation = () => {
      const canvasNode = document.createElement("canvas");
      node.appendChild(canvasNode);

      const animation = new DotLottie({
        canvas: canvasNode,
        loop,
        autoplay,
        src: animationLink,
        mode: direction === -1 ? "reverse" : "forward",
        speed
      });

      const handleScroll = () => handleScrollDotLottie(animation, node);

      animation.addEventListener("load", () =>
        attachScrollHandler(trigger, node, handleScroll)
      );

      let isPlaying = false;
      animation.addEventListener("complete", () => {
        isPlaying = false;
      });

      const triggerHandler = () => {
        if (!isPlaying) {
          if (direction === -1 && !loop) {
            animation.setFrame(animation.totalFrames);
          } else {
            animation.setFrame(0);
          }

          animation.play();

          isPlaying = true;
        }
      };

      createTriggerHandler(trigger, node, triggerHandler, () =>
        handleScrollDotLottie(animation, node)
      );
    };

    const cb = isLottieFile
      ? initializeDotLottieAnimation
      : initializeAnimation;

    if (loadLazy) {
      observerCallbacks.set(node, cb);
      observer.observe(node);
    } else cb();
  });
}
