import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isNullish } from "visual/utils/value";
import { Value } from "../Options/types/dev/Animation/types/Value";
import { getAnimations } from "./animations";
import { MultiAnimation } from "./types";

export const setHoverOptions = <T>(data: T) => {
  return encodeURI(
    JSON.stringify(data, (_, value) =>
      value === Infinity ? "Infinity" : value
    )
  );
};

export const getHoverOptions = (data: string): KeyframeEffectOptions =>
  JSON.parse(data, (_, value) => {
    return value === "Infinity" ? Infinity : value;
  });

export const hasInfiniteAnimation = (animation: string): boolean => {
  const { iterations } = getAnimations(animation)?.extraOptions ?? {};
  return iterations === Infinity;
};

export const getHoverAnimationOptions = (
  options: Partial<Value>,
  animationName: string
): KeyframeEffectOptions => {
  const { duration = 1000, infiniteAnimation = false } = options;

  return {
    duration,
    iterations:
      hasInfiniteAnimation(animationName) && infiniteAnimation ? Infinity : 1
  };
};

export const isMultiAnimation = (
  keyframes: Keyframe[] | MultiAnimation | undefined
): keyframes is MultiAnimation => {
  return !Array.isArray(keyframes) && keyframes !== undefined;
};
export const disableHoverForElements = [
  ElementTypes.Image,
  ElementTypes.Map,
  ElementTypes.Video,
  ElementTypes.ImageGallery
];

export const setAttribute = <T>(key: string, value: T) => {
  return isNullish(value) ? {} : { [key]: setHoverOptions(value) };
};
