import { isString } from "es-toolkit";
import { every, isNumber, isObject } from "es-toolkit/compat";
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
  return (
    isObject(keyframe) &&
    every(
      keyframe as Record<string, unknown>,
      (value, key, obj) =>
        obj.hasOwnProperty(key) && (isString(value) || isNumber(value))
    )
  );
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
  if (isObject(data)) {
    let options: OptionalEffectTiming = {};
    Object.keys(data as OptionalEffectTiming).forEach((key) => {
      if (isKeyofOptionalEffectTiming(key)) {
        //@ts-expect-error: type
        options[key] = data[key];
      }
    });
    return options;
  }

  return {};
};

interface Animation {
  multiAnimation?: Array<unknown>;
  endAnimation?: Record<string, unknown>;
  keyframes?: Array<unknown>;
  extraOptions?: unknown;
}

export const getMultiAnimationKeyframes = (
  keyframeEncoded: string
): MultiAnimation | undefined => {
  const animation: unknown | Animation = JSON.parse(decodeURI(keyframeEncoded));
  if (
    isObject(animation) &&
    Object.hasOwn(animation, "multiAnimation") &&
    Object.hasOwn(animation, "endAnimation")
  ) {
    const { multiAnimation = [], endAnimation = {} } = animation as Animation;

    if (Array.isArray(multiAnimation) && isObject(endAnimation)) {
      const isMultiAnimationValide = multiAnimation.every((animation) => {
        const { keyframes } = animation as Animation;
        return Array.isArray(keyframes) && keyframes.every(isValidKeyframe);
      });

      const _multiAnimation: AnimationBase[] = isMultiAnimationValide
        ? multiAnimation.map((animation) => {
            const { keyframes, extraOptions } = animation as Animation;
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
