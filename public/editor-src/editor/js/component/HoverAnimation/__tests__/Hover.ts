import { Hover, settleAnimation } from "../Hover";

// jsdom provides NO Web Animations API: `element.getAnimations`, `Animation`,
// `KeyframeEffect` and `element.animate` are all undefined. We therefore cannot
// exercise real WAAPI timing here — these tests cover the branching logic of
// `settleAnimation` and `reverse()` against mock `Animation` objects. The real
// visual smoothness (does dropping a fill snap the pixels?) and the "no zombie
// animations remain" guarantee are browser behaviors verified by the manual
// matrix in docs/plans/hover-snap-fix-plan.md (§6).

type MockAnimation = {
  playState: AnimationPlayState;
  currentTime: number | null;
  playbackRate: number;
  onfinish: (() => void) | null;
  effect: { updateTiming: jest.Mock };
  cancel: jest.Mock;
  play: jest.Mock;
  reverse: jest.Mock;
};

function makeAnimation(over: Partial<MockAnimation> = {}): MockAnimation {
  return {
    playState: "running",
    currentTime: 500,
    playbackRate: 1,
    onfinish: null,
    effect: { updateTiming: jest.fn() },
    cancel: jest.fn(),
    play: jest.fn(),
    reverse: jest.fn(),
    ...over
  };
}

// Asserts the anti-snap invariant: no `updateTiming` call ever carries a `fill`.
function expectNoFillStrip(animation: MockAnimation): void {
  animation.effect.updateTiming.mock.calls.forEach(([arg]) => {
    expect(Object.prototype.hasOwnProperty.call(arg ?? {}, "fill")).toBe(false);
  });
}

describe("settleAnimation", () => {
  // T1 — Reversible, full-dwell leave: finished forward hold.
  it("cancels a finished animation immediately without stripping fill", () => {
    const animation = makeAnimation({ playState: "finished" });

    settleAnimation(animation as unknown as Animation);

    expect(animation.cancel).toHaveBeenCalledTimes(1);
    expect(animation.onfinish).toBeNull();
    expectNoFillStrip(animation);
  });

  // T2 — Reversible, mid-flight / just-reversed leave: reverse running.
  it("keeps a running animation alive and cancels it on finish", () => {
    const animation = makeAnimation({ playState: "running" });

    settleAnimation(animation as unknown as Animation);

    expect(animation.cancel).not.toHaveBeenCalled();
    expect(typeof animation.onfinish).toBe("function");

    animation.onfinish?.();
    expect(animation.cancel).toHaveBeenCalledTimes(1);

    expect(animation.effect.updateTiming).toHaveBeenCalledWith({
      iterations: 1
    });
    expectNoFillStrip(animation);
  });

  // T3 — Non-reversible, identity-ending, finished (same routing as T1).
  it("cancels a finished non-reversible animation without stripping fill", () => {
    const animation = makeAnimation({ playState: "finished" });

    settleAnimation(animation as unknown as Animation);

    expect(animation.cancel).toHaveBeenCalledTimes(1);
    expectNoFillStrip(animation);
  });

  // T4 — Infinite wind-down flips to finished: playState read AFTER updateTiming.
  it("reads playState after winding iterations down to one", () => {
    const animation = makeAnimation({ playState: "running" });
    animation.effect.updateTiming.mockImplementation(() => {
      animation.playState = "finished";
    });

    settleAnimation(animation as unknown as Animation);

    expect(animation.effect.updateTiming).toHaveBeenCalledWith({
      iterations: 1
    });
    expect(animation.cancel).toHaveBeenCalledTimes(1);
  });

  // T5 — Idle animation.
  it("cancels an idle animation immediately without stripping fill", () => {
    const animation = makeAnimation({ playState: "idle" });

    settleAnimation(animation as unknown as Animation);

    expect(animation.cancel).toHaveBeenCalledTimes(1);
    expectNoFillStrip(animation);
  });

  // T5b — Paused animation: cancelled immediately. A paused animation never
  // reaches its natural end, so deferring to `onfinish` would never fire and
  // leak a zombie holding its fill. Not expected in the hover flow, handled
  // defensively.
  it("cancels a paused animation immediately without stripping fill", () => {
    const animation = makeAnimation({ playState: "paused" });

    settleAnimation(animation as unknown as Animation);

    expect(animation.cancel).toHaveBeenCalledTimes(1);
    expect(animation.onfinish).toBeNull();
    expectNoFillStrip(animation);
  });

  // T6 — Always winds down iterations exactly once with { iterations: 1 }.
  it("always winds iterations down to one", () => {
    const states: AnimationPlayState[] = [
      "running",
      "paused",
      "finished",
      "idle"
    ];

    states.forEach((playState) => {
      const animation = makeAnimation({ playState });

      settleAnimation(animation as unknown as Animation);

      expect(animation.effect.updateTiming).toHaveBeenCalledTimes(1);
      expect(animation.effect.updateTiming).toHaveBeenCalledWith({
        iterations: 1
      });
    });
  });

  // T7 — No `fill: "none"` anywhere across every branch (direct anti-snap check).
  it("never passes a fill to updateTiming in any branch", () => {
    const states: AnimationPlayState[] = [
      "running",
      "paused",
      "finished",
      "idle"
    ];

    states.forEach((playState) => {
      const animation = makeAnimation({ playState });

      settleAnimation(animation as unknown as Animation);

      expect(animation.effect.updateTiming).toHaveBeenCalled();
      expectNoFillStrip(animation);
    });
  });
});

describe("Hover.play / reverse", () => {
  beforeAll(() => {
    // The Hover constructor builds a controller via `new KeyframeEffect(...)` /
    // `new Animation(...)`, none of which exist in jsdom. Stub them so the
    // constructor runs; we then overwrite the private controller with a mock.
    (globalThis as unknown as { KeyframeEffect: unknown }).KeyframeEffect =
      class {};
    (globalThis as unknown as { Animation: unknown }).Animation = class {};
    (globalThis.document as unknown as { timeline?: unknown }).timeline ??= {};
  });

  function makeHover(mockAnim: MockAnimation): Hover {
    const hover = new Hover({
      target: document.createElement("div"),
      keyframes: [],
      options: {}
    });
    (hover as unknown as { controller: MockAnimation }).controller = mockAnim;

    return hover;
  }

  // T8 — currentTime === 0 sub-frame leave: cancel, do not reverse.
  it("cancels instead of reversing when currentTime is 0", () => {
    const controller = makeAnimation({
      playState: "running",
      currentTime: 0
    });
    const hover = makeHover(controller);

    hover.play("reverse");

    expect(controller.cancel).toHaveBeenCalledTimes(1);
    expect(controller.reverse).not.toHaveBeenCalled();
  });

  // T9 — Idle sub-frame leave: cancel, do not reverse.
  it("cancels instead of reversing when the controller is idle", () => {
    const controller = makeAnimation({
      playState: "idle",
      currentTime: null
    });
    const hover = makeHover(controller);

    hover.play("reverse");

    expect(controller.cancel).toHaveBeenCalledTimes(1);
    expect(controller.reverse).not.toHaveBeenCalled();
  });

  // T10 — Normal mid-flight / full-dwell reverse.
  it("reverses a mid-flight animation without cancelling", () => {
    const controller = makeAnimation({
      playState: "running",
      currentTime: 500
    });
    const hover = makeHover(controller);

    hover.play("reverse");

    expect(controller.reverse).toHaveBeenCalledTimes(1);
    expect(controller.cancel).not.toHaveBeenCalled();
  });

  // T12 — Finished full-dwell reverse: the reported bug's primary trigger.
  // A finished forward hold (currentTime past 0) must reverse, not cancel —
  // this is the path whose destructive cleanup used to snap the element.
  it("reverses a finished full-dwell animation without cancelling", () => {
    const controller = makeAnimation({
      playState: "finished",
      currentTime: 1000
    });
    const hover = makeHover(controller);

    hover.play("reverse");

    expect(controller.reverse).toHaveBeenCalledTimes(1);
    expect(controller.cancel).not.toHaveBeenCalled();
  });

  // T11 — play("normal") unchanged.
  it("plays forward with playbackRate 1 on normal and never reverses", () => {
    const controller = makeAnimation({
      playState: "running",
      currentTime: 500
    });
    const hover = makeHover(controller);

    hover.play("normal");

    expect(controller.playbackRate).toBe(1);
    expect(controller.play).toHaveBeenCalledTimes(1);
    expect(controller.reverse).not.toHaveBeenCalled();
  });
});
