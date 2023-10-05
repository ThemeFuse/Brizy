import _ from "underscore";
import {
  AnimationBase,
  MultiAnimation
} from "visual/component/HoverAnimation/types";

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

export const isKeyofKeyframeEffectOptions = (
  key: string
): key is keyof KeyframeEffectOptions => {
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

export const readKeyframeOptions = (data: unknown): KeyframeEffectOptions => {
  if (_.isObject(data)) {
    let options: KeyframeEffectOptions = {};
    Object.keys(data).forEach((key) => {
      if (isKeyofKeyframeEffectOptions(key)) {
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
      let isMultiAnimationValide = multiAnimation.every((animation) => {
        const { keyframes } = animation;
        return Array.isArray(keyframes) && keyframes.every(isValidKeyframe);
      });

      let _multiAnimation: AnimationBase[] = isMultiAnimationValide
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
