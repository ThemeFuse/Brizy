export interface AnimationOptions {
  animation: Keyframe[] | MultiAnimation;
  extraOptions?: KeyframeEffectOptions;
  reversibleAnimation?: boolean;
}

export interface MultiAnimation {
  multiAnimation: AnimationBase[];
  endAnimation: AnimationBase;
}

export interface AnimationBase {
  keyframes: Keyframe[];
  extraOptions?: KeyframeEffectOptions;
}

export interface AnimationEmmitterInfo {
  animationIsRunning: boolean;
  animationId: string;
}

export type AnimationMode = "normal" | "reverse";
