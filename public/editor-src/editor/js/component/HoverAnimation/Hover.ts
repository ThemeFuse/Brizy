export class Hover {
  private effects: KeyframeEffect | undefined = undefined;
  public controller: Animation | undefined = undefined;

  constructor({
    child,
    keyframes,
    options
  }: {
    child: HTMLElement;
    keyframes: Keyframe[];
    options: KeyframeEffectOptions;
  }) {
    this.effects = new KeyframeEffect(child, keyframes, options);
    this.controller = new Animation(this.effects, document.timeline);
  }

  private getRate(mode: "normal" | "reverse"): 1 | -1 {
    return mode === "normal" ? 1 : -1;
  }

  public play(mode: "normal" | "reverse"): void {
    if (this.controller) {
      this.controller.playbackRate = this.getRate(mode);
      this.controller.play();
    }
  }

  private setIterations({ iterations }: { iterations: number }): void {
    this.controller?.effect?.updateTiming({
      iterations
    });
  }

  public setEffectsOnMouseEnter(options: KeyframeEffectOptions): void {
    const { iterations } = options;

    if (iterations === Infinity) {
      this.setIterations({ iterations: Infinity });
    }
  }

  public setEffectsOnMouseLeave(options: KeyframeEffectOptions): void {
    const { iterations } = options;

    if (iterations === Infinity) {
      this.controller?.effect?.updateTiming({
        iterations: 1
      });

      if (this.controller?.effect) {
        const ct = this.controller.effect.getComputedTiming();

        // For smooth animation end
        this.controller.currentTime =
          Number(ct.currentIteration) * Number(ct.duration) +
          (Number(ct.duration) - (Number(ct.localTime) % Number(ct.duration)));
      }
    }
  }
}
