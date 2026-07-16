import { noop } from "es-toolkit";
import { AnimationBase, AnimationMode } from "./types";

/**
 * Return a single animation to the element's natural state as part of a hover
 * cleanup, without ever snapping the element mid-transition.
 *
 * - Loop animations are wound down to a single iteration so they settle after
 *   finishing the current cycle instead of repeating forever.
 * - A running / play-pending animation (e.g. a reverse we just started, or a
 *   one-shot still playing) keeps its fill-hold intact and is cancelled exactly
 *   when it reaches its natural end — never before.
 * - A finished / idle / paused animation is cancelled immediately. Nothing will
 *   drive it to a natural end, so deferring to `onfinish` would never fire and
 *   leak a zombie still holding its fill; we drop that hold and remove it from
 *   the node now. For hover effects that end at the natural value this is
 *   visually a no-op. (`paused` is not expected in the hover flow — controllers
 *   are only ever played or reversed — but it is handled defensively.)
 *
 * NOTE: `iterations: 1` may flip a looping animation straight to "finished",
 * so `playState` is read AFTER `updateTiming` and routed accordingly.
 */
export function settleAnimation(animation: Animation): void {
  animation.effect?.updateTiming({ iterations: 1 });

  const { playState } = animation;

  if (
    playState === "finished" ||
    playState === "idle" ||
    playState === "paused"
  ) {
    animation.cancel();
    return;
  }

  animation.onfinish = () => {
    animation.cancel();
  };
}

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
    if (!this.controller) {
      return;
    }

    if (mode === "reverse") {
      this.reverse();
      return;
    }

    this.controller.playbackRate = this.getRate(mode);
    this.controller.play();
  }

  private reverse(): void {
    const controller = this.controller;
    if (!controller) {
      return;
    }

    // `currentTime` is typed CSSNumberish|null in newer DOM libs, but every
    // current browser returns a plain number of milliseconds here.
    const currentTime =
      typeof controller.currentTime === "number" ? controller.currentTime : 0;

    // Same-frame enter+leave: the forward animation has not advanced yet.
    // reverse() would seek to the effect end and flash the hovered value, and
    // letting it keep playing forward would animate in and then snap off.
    // Cancel now so the element simply stays at its natural state.
    if (controller.playState === "idle" || currentTime <= 0) {
      controller.cancel();
      return;
    }

    controller.reverse();
  }

  public cancelAllAnimations(): void {
    this.node?.getAnimations().forEach(settleAnimation);
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
