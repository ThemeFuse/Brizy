import { noop } from "es-toolkit";
import { AnimationBase, AnimationMode } from "./types";

export class Hover {
  private effects: KeyframeEffect | undefined = undefined;
  public controller: Animation | undefined = undefined;
  private node: Element | null = null;
  constructor({
    target,
    keyframes,
    options
  }: {
    target: Element;
    keyframes: Keyframe[];
    options: OptionalEffectTiming;
  }) {
    this.node = target;
    this.updateAnimation(keyframes, options, target);
  }

  private getRate(mode: AnimationMode): 1 | -1 {
    return mode === "normal" ? 1 : -1;
  }

  public play(mode: AnimationMode): void {
    if (this.controller) {
      this.controller.playbackRate = this.getRate(mode);
      this.controller.play();
    }
  }

  public cancelAllAnimations(): void {
    const animations = this.node?.getAnimations();
    animations?.forEach((animation) => {
      animation.effect?.updateTiming({ iterations: 1, fill: "none" });
      animation.onfinish = () => {
        animation.cancel();
      };
    });
  }

  public setEffectsOnMouseEnter(options: OptionalEffectTiming): void {
    if (this.controller) {
      this.controller.onfinish = noop;
      this.controller.effect?.updateTiming(options);
    }
  }

  public setEffectsOnMouseLeave(options: OptionalEffectTiming): void {
    const { iterations } = options;
    if (iterations === Infinity) {
      this.controller?.effect?.updateTiming({
        iterations: 1
      });
    }
  }

  public updateAnimation(
    keyframes: Keyframe[],
    options: OptionalEffectTiming,
    child: Element
  ) {
    if (this.node) {
      this.effects = new KeyframeEffect(child, keyframes, options);
      this.controller = new Animation(this.effects, document.timeline);
    }
  }

  public endSequenceAnimation({
    keyframes,
    extraOptions = {},
    options = {}
  }: {
    keyframes: Keyframe[];
    extraOptions?: OptionalEffectTiming;
    options?: OptionalEffectTiming;
  }) {
    if (this.controller && this.effects) {
      this.effects.setKeyframes(keyframes);
      this.effects.updateTiming({
        ...options,
        ...extraOptions
      });
      this.controller.play();
    }
  }

  public startSequenceAnimation({
    keyframes,
    options
  }: {
    keyframes: AnimationBase[];
    options: OptionalEffectTiming;
  }): void {
    if (this.controller) {
      keyframes.forEach((animation) => {
        if (this.controller?.playState === "running") {
          this.controller.onfinish = () => {
            this.effects?.setKeyframes(animation.keyframes);
            this.effects?.updateTiming({
              ...options,
              ...animation.extraOptions
            });
            this.controller?.play();
          };
        } else {
          if (this.effects && this.controller) {
            this.effects.setKeyframes(animation.keyframes);
            this.effects.updateTiming({
              ...options,
              ...animation.extraOptions
            });
            this.controller.play();
          }
        }
      });
    }
  }
}
