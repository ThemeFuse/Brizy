import _ from "underscore";
import {
  AnimationBase,
  MultiAnimation
} from "visual/component/HoverAnimation/types";
import { AnimationEvents } from "visual/utils/animation";
import { HoverAnimation, SideEffectCallback } from ".";

export const getKeyframe = (keyframeEncoded: string): Keyframe[] => {
  return JSON.parse(decodeURI(keyframeEncoded));
};

export const isValidKeyframe = (keyframe: unknown): keyframe is Keyframe => {
  if (!_.isObject(keyframe)) {
    return false;
  }

  for (const key in keyframe) {
    if (!keyframe.hasOwnProperty(key)) {
      continue;
    }

    const value = keyframe[key];
    if (typeof value !== "string" && typeof value !== "number") {
      return false;
    }
  }

  return true;
};

export const readKeyframes = (keyframes: unknown): Keyframe[] => {
  if (Array.isArray(keyframes)) {
    if (keyframes.every(isValidKeyframe)) return keyframes;
  }

  return [];
};

export const isKeyofOptionalEffectTiming = (
  key: string
): key is keyof OptionalEffectTiming => {
  const allowedKeys = [
    "composite",
    "iterationComposite",
    "pseudoElement",
    "delay",
    "direction",
    "duration",
    "easing",
    "endDelay",
    "fill",
    "iterationStart",
    "iterations",
    "playbackRate"
  ];

  return allowedKeys.includes(key);
};

export const readKeyframeOptions = (data: unknown): OptionalEffectTiming => {
  if (_.isObject(data)) {
    let options: OptionalEffectTiming = {};
    Object.keys(data).forEach((key) => {
      if (isKeyofOptionalEffectTiming(key)) {
        options[key] = data[key];
      }
    });
    return options;
  }

  return {};
};

export const getMultiAnimationKeyframes = (
  keyframeEncoded: string
): MultiAnimation | undefined => {
  const animation: unknown = JSON.parse(decodeURI(keyframeEncoded));
  if (
    _.isObject(animation) &&
    Object.hasOwn(animation, "multiAnimation") &&
    Object.hasOwn(animation, "endAnimation")
  ) {
    const { multiAnimation = [], endAnimation = {} } = animation;

    if (Array.isArray(multiAnimation) && _.isObject(endAnimation)) {
      const isMultiAnimationValide = multiAnimation.every((animation) => {
        const { keyframes } = animation;
        return Array.isArray(keyframes) && keyframes.every(isValidKeyframe);
      });

      const _multiAnimation: AnimationBase[] = isMultiAnimationValide
        ? multiAnimation.map((animation) => {
            const { keyframes, extraOptions } = animation;
            return {
              keyframes: readKeyframes(keyframes),
              extraOptions: readKeyframeOptions(extraOptions)
            };
          })
        : [];

      return {
        multiAnimation: _multiAnimation,
        endAnimation: {
          keyframes: readKeyframes(endAnimation.keyframes),
          extraOptions: readKeyframeOptions(endAnimation.extraOptions)
        }
      };
    }
    return undefined;
  }
};

const effectOnEntranceOn: SideEffectCallback = (animationId, setCanHover) => {
  window.Brz.on(AnimationEvents.entranceOn, (_animationId: string) => {
    if (animationId === _animationId) {
      setCanHover(false);
    }
  });
};

const effectOnEntranceOff: SideEffectCallback = (animationId, setCanHover) => {
  window.Brz.on(AnimationEvents.entranceOff, (_animationId: string) => {
    if (animationId === _animationId) {
      setCanHover(true);
    }
  });
};

export const initHoverAnimation = (hoverContainerNode: Element) => {
  hoverContainerNode
    .querySelectorAll<HTMLElement>(".brz-hover-animation__container")
    .forEach((node) => {
      const hoverAnimation = new HoverAnimation({ node });
      hoverAnimation.sideEffects([effectOnEntranceOn, effectOnEntranceOff]);
    });
};
