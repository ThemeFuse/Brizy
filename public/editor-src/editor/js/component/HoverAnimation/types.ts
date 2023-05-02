export interface AnimationOptions {
  animation: Keyframe[];
  extraOptions: KeyframeEffectOptions;
}

export interface AnimationEmmitterInfo {
  animationIsRunning: boolean;
  animationId: string;
}
