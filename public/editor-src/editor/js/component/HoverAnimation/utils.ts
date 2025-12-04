import { Value } from "visual/utils/options/Animation/types/Value";
import { isNullish } from "visual/utils/value";
import { getAnimations } from "./animations";
import { HoverTarget, MultiAnimation } from "./types";

export const setHoverOptions = <T>(data: T): string => {
  return encodeURI(
    JSON.stringify(data, (_, value) =>
      value === Infinity ? "Infinity" : value
    )
  );
};

export const getHoverOptions = (data: string): OptionalEffectTiming =>
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
): OptionalEffectTiming => {
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

export const setAttribute = <T>(
  key: string,
  value: T
): Record<string, string> => {
  return isNullish(value) ? {} : { [key]: setHoverOptions(value) };
};

export const isValidSelector = (selector: string) => {
  try {
    document.createDocumentFragment().querySelector(selector);
    return true;
  } catch (_) {
    return false;
  }
};

export const getHoverTarget = <T extends Element = Element>(
  parentElement: T,
  key: HoverTarget
): Element | null => {
  switch (key) {
    case "parent":
      return parentElement;
    case "firstChild":
      return parentElement.firstElementChild;
  }
  return parentElement.querySelector(key);
};
