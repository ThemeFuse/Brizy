// A number tween that keeps the timing of jQuery's `$({ n }).animate()`.

interface Options {
  start: number;
  end: number;
  duration: number;
  step: (value: number) => void;
  complete: VoidFunction;
}

export interface Tween {
  finish: VoidFunction;
}

type Timer = () => boolean;

const HIDDEN_TAB_INTERVAL = 13;

const timers: Timer[] = [];
let inProgress = false;
let now: number | undefined;

// Tweens created in one synchronous run share their start time.
function createNow(): number {
  setTimeout(() => {
    now = undefined;
  });
  now = Date.now();

  return now;
}

function tick(): void {
  now = Date.now();

  for (let index = 0; index < timers.length; index++) {
    const timer = timers[index];

    if (!timer() && timers[index] === timer) {
      timers.splice(index, 1);
      index--;
    }
  }

  if (!timers.length) {
    inProgress = false;
  }
  now = undefined;
}

function schedule(): void {
  if (!inProgress) {
    return;
  }

  if (document.hidden === false) {
    requestAnimationFrame(schedule);
  } else {
    setTimeout(schedule, HIDDEN_TAB_INTERVAL);
  }

  tick();
}

export function tween(options: Options): Tween {
  const { start, end, step, complete } = options;
  // A page's jQuery can switch every effect off.
  const fxOff = typeof window !== "undefined" && window.jQuery?.fx?.off;
  const duration = fxOff ? 0 : options.duration;
  const from = Number.isFinite(end) ? start || 0 : start;
  const startTime = now || createNow();
  let value = start;
  let stopped = false;

  // `step` sees the value of the previous run.
  const run = (percent: number): void => {
    step(value);
    value = (end - from) * percent + from;
  };

  const timer: Timer = () => {
    if (stopped) {
      return false;
    }

    const remaining = Math.max(0, startTime + duration - (now || createNow()));
    const percent = 1 - (remaining / duration || 0);

    run(percent);

    if (percent < 1) {
      return true;
    }

    complete();

    return false;
  };

  timers.push(timer);

  if (!inProgress) {
    inProgress = true;
    schedule();
  }

  return {
    finish: (): void => {
      const index = timers.indexOf(timer);

      if (index === -1) {
        return;
      }

      stopped = true;
      run(1);
      complete();
      timers.splice(index, 1);
    }
  };
}
