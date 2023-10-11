export interface AnimationOptions {
  animation: Keyframe[] | MultiAnimation;
  extraOptions?: OptionalEffectTiming;
  reversibleAnimation?: boolean;
}

export interface MultiAnimation {
  multiAnimation: AnimationBase[];
  endAnimation: AnimationBase;
}

export interface AnimationBase {
  keyframes: Keyframe[];
  extraOptions?: OptionalEffectTiming;
}

export interface AnimationEmmitterInfo {
  animationIsRunning: boolean;
  animationId: string;
}

export type AnimationMode = "normal" | "reverse";

export type HoverTarget = "parent" | "firstChild" | string;
