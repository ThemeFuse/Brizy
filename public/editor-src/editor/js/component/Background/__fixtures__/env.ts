// Test-only helpers for the component/Background suites. Nothing in the app imports them.
//
// They exist because jsdom reports no layout at all: every element has zero client rects,
// `documentElement.clientHeight` is 0 and `matchMedia` is missing. The plugins under test read
// exactly those three things, so a suite that forgets one of them silently exercises a degenerate
// path (`getHeight` divides by 0 and yields `Infinity`, `getCurrentDevice` always answers desktop).

import { noop } from "es-toolkit";

type Device = "desktop" | "tablet" | "mobile";

const MOBILE_QUERY = "(max-width: 767px)";
const TABLET_QUERY = "(min-width: 768px) and (max-width: 991px)";

let device: Device = "desktop";

// `utils/export` keeps the MediaQueryList objects it got at import time, so `matches` has to stay
// live for a later device switch to be visible.
class LiveMediaQueryList extends EventTarget implements MediaQueryList {
  readonly media: string;
  onchange: MediaQueryList["onchange"] = null;

  constructor(media: string) {
    super();
    this.media = media;
  }

  get matches(): boolean {
    switch (this.media) {
      case MOBILE_QUERY:
        return device === "mobile";
      case TABLET_QUERY:
        return device === "tablet";
      default:
        return false;
    }
  }

  addListener: MediaQueryList["addListener"] = noop;
  removeListener: MediaQueryList["removeListener"] = noop;
}

// `$(window).height()` is `documentElement.clientHeight`, `$(window).outerHeight(true)` is
// `window.innerHeight`, and the plugin's own `windowHeight` is the max of the two. Keeping them
// separate is what makes a wrong translation visible.
export interface Viewport {
  clientHeight: number;
  innerHeight: number;
}

export interface BackgroundEnv {
  scrollBy: jest.Mock<void, [number, number]>;
  play: jest.Mock<void, []>;
  pause: jest.Mock<void, []>;
  setViewport: (viewport: Viewport) => void;
  setDevice: (next: Device) => void;
}

// Must run before the module under test is imported: `utils/export/index.ts` evaluates its media
// queries once, at import time.
export function installBackgroundEnv(): BackgroundEnv {
  device = "desktop";

  const scrollBy = jest.fn<void, [number, number]>();
  const play = jest.fn<void, []>();
  const pause = jest.fn<void, []>();

  define(
    window,
    "matchMedia",
    (media: string) => new LiveMediaQueryList(media)
  );
  define(window, "scrollBy", scrollBy);
  define(HTMLMediaElement.prototype, "play", play);
  define(HTMLMediaElement.prototype, "pause", pause);

  const setViewport = ({ clientHeight, innerHeight }: Viewport): void => {
    define(document.documentElement, "clientHeight", clientHeight);
    define(window, "innerHeight", innerHeight);
  };

  setViewport({ clientHeight: 768, innerHeight: 768 });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  return {
    scrollBy,
    play,
    pause,
    setViewport,
    setDevice: (next: Device): void => {
      device = next;
    }
  };
}

export function restoreBackgroundEnv(): void {
  device = "desktop";
  // jsdom keeps one document per test file, so a scroll position left behind by an earlier case
  // silently shifts the next one's first frame.
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  Reflect.deleteProperty(window, "matchMedia");
  Reflect.deleteProperty(window, "scrollBy");
  Reflect.deleteProperty(HTMLMediaElement.prototype, "play");
  Reflect.deleteProperty(HTMLMediaElement.prototype, "pause");
  Reflect.deleteProperty(document.documentElement, "clientHeight");
  Reflect.deleteProperty(window, "innerHeight");
}

// jQuery reads `getClientRects().length` before it trusts a measurement, and `offset()` adds the
// page scroll to `getBoundingClientRect().top`.
export function setRect(
  element: HTMLElement,
  rect: { top: number; height: number }
): void {
  const value: DOMRect = {
    x: 0,
    y: rect.top,
    top: rect.top,
    bottom: rect.top + rect.height,
    left: 0,
    right: 0,
    width: 0,
    height: rect.height,
    toJSON: () => ({})
  };

  element.getBoundingClientRect = (): DOMRect => value;
  define(element, "getClientRects", () => [value]);
}

export function setScrollTop(top: number): void {
  document.documentElement.scrollTop = top;
  window.dispatchEvent(new Event("scroll"));
}

function define(target: object, property: string, value: unknown): void {
  Object.defineProperty(target, property, {
    configurable: true,
    writable: true,
    value
  });
}
