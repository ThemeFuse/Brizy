import { MultiAnimation } from "visual/component/HoverAnimation/types";
import * as Str from "visual/utils/reader/string";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { Hover } from "../../component/HoverAnimation/Hover";
import {
  getHoverOptions,
  getHoverTarget,
  isValidSelector
} from "../../component/HoverAnimation/utils";
import { getKeyframe, getMultiAnimationKeyframes } from "./utils";

interface Settings {
  node: HTMLElement;
}

export type SideEffectCallback = (
  animationId: string,
  setCanHover: (canHover: boolean) => void
) => void;

const getCurrentDevice = (): ResponsiveMode => {
  const { innerWidth } = window;
  let device: ResponsiveMode = "desktop";

  if (innerWidth < 992) {
    device = "tablet";
  }
  if (innerWidth < 768) {
    device = "mobile";
  }

  return device;
};

export class HoverAnimation {
  private canHover: boolean = true;
  private animationId: string | null = null;
  private elementWasHovered: boolean = false;
  private settings: OptionalEffectTiming = {};
  private keyframes: Keyframe[] = [];
  private reversibleAnimation: boolean = true;
  private multiAnimationSettings: MultiAnimation | undefined = undefined;
  constructor({ node }: Settings) {
    this.animationId = this.getAttribute(node, "animationid");
    this.reversibleAnimation = this.getAttribute(node, "reversible") === "true";
    const options = this.getAttribute(node, "options");
    const multiAnimationSettings = this.getAttribute(node, "multiAnimation");

    if (multiAnimationSettings) {
      this.multiAnimationSettings = this.getMultiAnimation(
        multiAnimationSettings
      );
    }
    if (options) {
      this.settings = this.getOptions(options);
    }

    const keyframeEncoded = this.getAttribute(node, "animation");
    if (keyframeEncoded) {
      this.keyframes = this.getKeyframesInfo(keyframeEncoded);
    }
    const target = this.getTarget(node);
    if (target) {
      const controller = new Hover({
        target,
        keyframes: this.keyframes,
        options: this.settings
      });

      this.attachMouseLeave({ node, controller });
      this.attachMouseEnter({ node, controller });
    }
  }

  public sideEffects = (callbacks: SideEffectCallback[]): void => {
    callbacks.forEach((fn) => {
      if (this.animationId !== null) {
        fn(this.animationId, this.setCanHover);
      }
    });
  };

  private setCanHover = (runAnimation: boolean): void => {
    this.canHover = runAnimation;
  };

  private attachMouseEnter = ({
    node,
    controller
  }: {
    node: HTMLElement;
    controller: Hover;
  }): void => {
    node.addEventListener("mouseenter", () => {
      const device = getCurrentDevice();
      if (this.canHover && device === "desktop") {
        controller.setEffectsOnMouseEnter(this.settings);
        if (this.multiAnimationSettings) {
          const { multiAnimation } = this.multiAnimationSettings;
          controller.startSequenceAnimation({
            keyframes: multiAnimation,
            options: this.settings
          });
        } else {
          controller.play("normal");
        }

        this.elementWasHovered = true;
      }
    });
  };

  private attachMouseLeave = ({
    node,
    controller
  }: {
    node: HTMLElement;
    controller: Hover;
  }): void => {
    node.addEventListener("mouseleave", () => {
      if (this.canHover && this.elementWasHovered) {
        controller.setEffectsOnMouseLeave(this.settings);
        if (this.multiAnimationSettings) {
          const { endAnimation } = this.multiAnimationSettings;
          controller.endSequenceAnimation({
            keyframes: endAnimation.keyframes,
            extraOptions: endAnimation.extraOptions,
            options: this.settings
          });
        } else {
          if (this.reversibleAnimation) {
            controller.play("reverse");
          }
        }
        this.elementWasHovered = false;
        controller.cancelAllAnimations();
      }
    });
  };

  private getOptions = (options: string): OptionalEffectTiming => {
    let settings: OptionalEffectTiming = {};

    try {
      settings = getHoverOptions(decodeURI(options));
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("ERROR: ", e);
      }
    }

    return settings;
  };

  private getAttribute = (node: Element, attr: string): string | null => {
    return node.getAttribute(`data-brz-hover-${attr}`);
  };

  private getTarget = (node: Element): Element | null => {
    const _target = this.getAttribute(node, "target");
    if (_target) {
      try {
        const target: unknown = JSON.parse(decodeURI(_target));
        if (Str.is(target) && isValidSelector(target)) {
          return getHoverTarget(node, target);
        }
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.error("ERROR: ", e);
        }
      }
    }

    return null;
  };

  private getKeyframesInfo = (keyframeEncoded: string): Keyframe[] => {
    let keyframes: Keyframe[] = [];

    try {
      keyframes = getKeyframe(keyframeEncoded);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("ERROR: ", e);
      }
    }

    return keyframes;
  };

  private getMultiAnimation = (
    keyframeEncoded: string
  ): MultiAnimation | undefined => {
    let multiAnimation: MultiAnimation | undefined = undefined;

    try {
      multiAnimation = getMultiAnimationKeyframes(keyframeEncoded);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("ERROR: ", e);
      }
    }

    return multiAnimation;
  };
}
