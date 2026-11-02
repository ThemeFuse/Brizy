// Property tweens for the slider: linear, frame-driven, queued per element.

import { setStyle } from "./dimensions";

/** Properties written without a unit among those the slider animates. */
const UNITLESS = new Set(["opacity", "zIndex"]);

const INTERVAL = 13;

let frameNow: number | undefined;

/** One timestamp for everything that runs in the same task. */
function now(): number {
  if (frameNow === undefined) {
    frameNow = Date.now();
    setTimeout(() => {
      frameNow = undefined;
    });
  }

  return frameNow;
}

function nextFrame(win: Window, callback: () => void): void {
  if (win.document.hidden === false && typeof win.requestAnimationFrame === "function") {
    win.requestAnimationFrame(callback);
  } else {
    win.setTimeout(callback, INTERVAL);
  }
}

/** The value a tween starts from: the computed value, `0` when there is none. */
function startValue(element: HTMLElement, property: string): number {
  const win = element.ownerDocument.defaultView ?? window;
  const styles = win.getComputedStyle(element);
  const read: unknown = Reflect.get(styles, property);
  let value = styles.getPropertyValue(property) || (typeof read === "string" ? read : "");

  if (property === "opacity" && value === "") {
    value = "1";
  }

  const number = parseFloat(value);

  return Number.isFinite(number) ? number : 0;
}

type Step = () => void;

const queues = new WeakMap<HTMLElement, Step[]>();
const running = new WeakSet<HTMLElement>();

function dequeue(element: HTMLElement): void {
  const next = queues.get(element)?.shift();

  if (next) {
    next();
  } else {
    running.delete(element);
  }
}

function run(
  element: HTMLElement,
  targets: Record<string, number>,
  duration: number,
  complete: (() => void) | undefined
): void {
  const win = element.ownerDocument.defaultView ?? window;
  const tweens = Object.entries(targets).map(([property, end]) => ({
    property,
    start: startValue(element, property),
    end
  }));
  const startTime = now();

  const tick = (): boolean => {
    frameNow = Date.now();
    const remaining = Math.max(0, startTime + duration - frameNow);
    const percent = 1 - (remaining / duration || 0);

    tweens.forEach(({ property, start, end }) => {
      const value = (end - start) * percent + start;

      setStyle(element, property, UNITLESS.has(property) ? String(value) : `${value}px`);
    });
    frameNow = undefined;

    return percent < 1;
  };

  const loop = () => {
    if (tick()) {
      nextFrame(win, loop);
    } else {
      complete?.();
      dequeue(element);
    }
  };

  if (tick()) {
    nextFrame(win, loop);
  } else {
    complete?.();
    dequeue(element);
  }
}

/** Tweens a number from `from` to `to`: `step` gets every value, `complete` runs at the end. */
export function animateValue(
  win: Window,
  from: number,
  to: number,
  duration: number,
  step: (value: number) => void,
  complete: () => void
): void {
  const startTime = now();

  const tick = (): boolean => {
    frameNow = Date.now();
    const remaining = Math.max(0, startTime + duration - frameNow);
    const percent = 1 - (remaining / duration || 0);

    step((to - from) * percent + from);
    frameNow = undefined;

    return percent < 1;
  };

  const loop = () => {
    if (tick()) {
      nextFrame(win, loop);
    } else {
      complete();
    }
  };

  loop();
}

/** Tweens `targets` (property → end value) on `element` over `duration` ms, then calls `complete`. */
export function animate(
  element: HTMLElement,
  targets: Record<string, number>,
  duration: number,
  complete: (() => void) | undefined
): void {
  const start = () => run(element, targets, duration, complete);

  if (running.has(element)) {
    const queue = queues.get(element) ?? [];

    queue.push(start);
    queues.set(element, queue);
  } else {
    running.add(element);
    start();
  }
}
