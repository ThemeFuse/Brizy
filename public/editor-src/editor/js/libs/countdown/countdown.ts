// The Countdown / Countdown2 timer, replacing the jQuery `countdown` plugins 1:1, quirks included.

export interface CountdownRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface CountdownSettings {
  now: number;
  endDate: number;
  timeZoneOffset: number;
  tickInterval: number;
  onTick: (remaining: CountdownRemaining) => void;
}

export interface CountdownHandle {
  update: (settings: CountdownSettings) => void;
  destroy: () => void;
}

class CountdownTimer implements CountdownHandle {
  private settings: CountdownSettings;
  private readonly startTime: number;
  private intervalId: ReturnType<typeof setInterval> | undefined;

  constructor(settings: CountdownSettings) {
    this.settings = settings;
    this.startTime = Date.now();

    this.start();
    this.tick();
  }

  update(settings: CountdownSettings): void {
    this.settings = { ...this.settings, ...settings };
    if (this.intervalId === undefined) {
      this.start();
    }
    this.tick();
  }

  destroy(): void {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }

  private start(): void {
    this.intervalId = setInterval(
      () => this.tick(),
      this.settings.tickInterval
    );
  }

  private tick(): void {
    const now = this.settings.now + (Date.now() - this.startTime);
    const endDate = this.settings.endDate + this.settings.timeZoneOffset;

    const remaining = endDate - now;
    const isActive = remaining > 0;
    const days = isActive ? Math.floor(remaining / (24 * 60 * 60 * 1000)) : 0;
    const hours = isActive
      ? Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
      : 0;
    const minutes = isActive
      ? Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 1000)) % 60
      : 0;
    const seconds = isActive
      ? (Math.floor((remaining % (24 * 60 * 60 * 1000)) / 1000) % 60) % 60
      : 0;

    this.settings.onTick({ days, hours, minutes, seconds });

    if (!isActive) {
      this.destroy();
    }
  }
}

const instances = new WeakMap<HTMLElement, CountdownTimer>();

// Starts a countdown on the element, or updates the one it already has.
export function countdown(
  element: HTMLElement,
  settings: CountdownSettings
): CountdownHandle {
  const instance = instances.get(element);

  if (instance) {
    instance.update(settings);
    return instance;
  }

  const created = new CountdownTimer(settings);
  instances.set(element, created);
  return created;
}

export function getCountdown(
  element: HTMLElement
): CountdownHandle | undefined {
  return instances.get(element);
}
