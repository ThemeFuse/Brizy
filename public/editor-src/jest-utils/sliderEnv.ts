import { loadProRuntime, silenceConsole } from "./exportRuntime";
import { publishLibGroup } from "./libGroups";

// Test environment for the published-page sliders: jsdom layout and observer stubs.

// A suite's first mount loads the export modules; a busy CI runner needs more than the default 5s.
jest.setTimeout(30000);

export interface Layout {
  viewportWidth: number;
  viewportHeight: number;
  boxWidth: number;
  boxHeight: number;
}

const layout: Layout = {
  viewportWidth: 1280,
  viewportHeight: 800,
  boxWidth: 1000,
  boxHeight: 400
};

const pixels = (value: string): number | undefined => {
  const match = /^(-?[\d.]+)px$/.exec(value.trim());

  return match ? Number(match[1]) : undefined;
};

const boxOf = (element: Element): { width: number; height: number } => {
  const style = element instanceof HTMLElement ? element.style : undefined;

  return {
    width: (style && pixels(style.width)) ?? layout.boxWidth,
    height: (style && pixels(style.height)) ?? layout.boxHeight
  };
};

let layoutInstalled = false;

function installLayoutStubs(): void {
  if (layoutInstalled) {
    return;
  }

  layoutInstalled = true;

  const computed = window.getComputedStyle.bind(window);

  window.getComputedStyle = (element: Element, pseudo?: string | null) => {
    const styles = computed(element, pseudo);
    const dimension = (name: string): string | undefined => {
      if (name === "width") {
        return `${boxOf(element).width}px`;
      }
      if (name === "height") {
        return `${boxOf(element).height}px`;
      }
      return undefined;
    };

    return new Proxy(styles, {
      get(target, property) {
        if (property === "getPropertyValue") {
          return (name: string) =>
            dimension(name) ?? target.getPropertyValue(name);
        }
        if (typeof property === "string") {
          const value = dimension(property);

          if (value !== undefined) {
            return value;
          }
        }

        const value: unknown = Reflect.get(target, property, target);

        return typeof value === "function" ? value.bind(target) : value;
      }
    });
  };

  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get(this: HTMLElement) {
      return boxOf(this).width;
    }
  });
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get(this: HTMLElement) {
      return boxOf(this).height;
    }
  });

  const rectOf = (element: Element): DOMRect => {
    const { width, height } = boxOf(element);

    return new DOMRect(0, 0, width, height);
  };

  Element.prototype.getBoundingClientRect = function (this: Element) {
    return rectOf(this);
  };
  // A connected, rendered element has one rect.
  Object.defineProperty(Element.prototype, "getClientRects", {
    configurable: true,
    value(this: Element) {
      return [rectOf(this)];
    }
  });

  const bodyStyle = document.body.style;

  ["WebkitTransition", "webkitPerspective"].forEach((property) => {
    if (!(property in bodyStyle)) {
      Object.defineProperty(bodyStyle, property, {
        configurable: true,
        writable: true,
        value: ""
      });
    }
  });

  Object.defineProperty(document.documentElement, "clientWidth", {
    configurable: true,
    get: () => layout.viewportWidth
  });
  Object.defineProperty(document.documentElement, "clientHeight", {
    configurable: true,
    get: () => layout.viewportHeight
  });
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    get: () => layout.viewportWidth
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    get: () => layout.viewportHeight
  });
}

export function setLayout(next: Layout): void {
  Object.assign(layout, next);
}

/** Changes the viewport and fires the `resize` the page would see. */
export function resizeViewport(width: number, height: number): void {
  layout.viewportWidth = width;
  layout.viewportHeight = height;
  window.dispatchEvent(new Event("resize"));
}

// --- IntersectionObserver --------------------------------------------------------------------

type ObserverCallback = (entries: IntersectionObserverEntry[]) => void;

const observers: { callback: ObserverCallback; targets: Set<Element> }[] = [];

class ControlledIntersectionObserver {
  private readonly record: {
    callback: ObserverCallback;
    targets: Set<Element>;
  };

  constructor(callback: ObserverCallback) {
    this.record = { callback, targets: new Set() };
    observers.push(this.record);
  }

  observe(target: Element): void {
    this.record.targets.add(target);
  }

  unobserve(target: Element): void {
    this.record.targets.delete(target);
  }

  disconnect(): void {
    this.record.targets.clear();
  }

  takeRecords(): [] {
    return [];
  }
}

/** Reports `target` as entering or leaving the viewport to every observer watching it. */
export function intersect(target: Element, isIntersecting: boolean): void {
  observers
    .filter(({ targets }) => targets.has(target))
    .forEach(({ callback }) => {
      callback([
        {
          target,
          isIntersecting,
          intersectionRatio: isIntersecting ? 1 : 0,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: Date.now()
        }
      ]);
    });
}

export function isObserved(target: Element): boolean {
  return observers.some(({ targets }) => targets.has(target));
}

/** How many observers currently watch `target`. */
export function observerCount(target: Element): number {
  return observers.filter(({ targets }) => targets.has(target)).length;
}

// Present, so the IntersectionObserver polyfill leaves the controlled observer in place.
class ControlledIntersectionObserverEntry {
  get intersectionRatio(): number {
    return 0;
  }
}

// --- runtime ---------------------------------------------------------------------------------

/** Installs the layout stubs and the controlled IntersectionObserver. */
export async function installSliderEnvironment(): Promise<void> {
  installLayoutStubs();
  Object.defineProperty(window, "IntersectionObserver", {
    configurable: true,
    writable: true,
    value: ControlledIntersectionObserver
  });
  Object.defineProperty(window, "IntersectionObserverEntry", {
    configurable: true,
    writable: true,
    value: ControlledIntersectionObserverEntry
  });

  await new Promise((resolve) => setTimeout(resolve, 0));
}

/** Loads the bootstraps and publishes the slider lib group on `window.BrizyLibs`. */
export async function loadSliderRuntime(extraLibs: object): Promise<void> {
  silenceConsole();
  await installSliderEnvironment();

  await loadProRuntime({ kind: "real" }, { kind: "real" });

  const sliderLibs: object = await import("visual/libs/group-2");

  publishLibGroup("BrizyLibs", { ...sliderLibs, ...extraLibs });
  installEmitRecorder();
}

/** Settles the promise chains of a dispatch without waiting on timers. */
async function drainMicrotasks(): Promise<void> {
  for (let turn = 0; turn < 20; turn++) {
    await Promise.resolve();
  }
}

/** Mounts `html` and dispatches it the way a published page does. */
export async function mountPage(html: string): Promise<HTMLElement> {
  const root = document.createElement("div");

  root.innerHTML = html;
  document.body.append(root);

  window.Brz.emit("init.pro.dom", root);
  await drainMicrotasks();
  await jest.advanceTimersByTimeAsync(16);
  window.Brz.emit("init.dom", root);
  await drainMicrotasks();

  return root;
}

/** Ends a test's page: drops its markup, pending fake timers and running animations. */
export function endPage(): void {
  document.body.innerHTML = "";
  jest.clearAllTimers();
  jest.useRealTimers();
}

// --- emits -----------------------------------------------------------------------------------

export interface Emit {
  name: string;
  args: unknown[];
}

const recorder: { names: RegExp; emits: Emit[] } = { names: /^$/, emits: [] };

function installEmitRecorder(): void {
  const emit = window.Brz.emit.bind(window.Brz);

  window.Brz.emit = (name: string, ...args: unknown[]) => {
    if (recorder.names.test(name)) {
      recorder.emits.push({ name, args });
    }

    emit(name, ...args);
  };
}

/** Starts a fresh record of the `window.Brz.emit` calls whose name matches `names`, in order. */
export function recordEmits(names: RegExp): Emit[] {
  recorder.names = names;
  recorder.emits = [];

  return recorder.emits;
}

// --- interactions ----------------------------------------------------------------------------

export function click(element: Element): void {
  element.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true })
  );
}

const KEY_CODES: Record<string, number> = { ArrowLeft: 37, ArrowRight: 39 };

export function pressKey(
  element: Element,
  key: "ArrowLeft" | "ArrowRight"
): void {
  const event = new KeyboardEvent("keydown", {
    key,
    bubbles: true,
    cancelable: true
  });

  Object.defineProperty(event, "keyCode", { value: KEY_CODES[key] });
  element.dispatchEvent(event);
}

/** A mouse drag of `distance` pixels along x (negative = to the left). */
export function dragX(element: Element, distance: number): void {
  const at = (type: string, clientX: number): MouseEvent =>
    new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY: 100
    });

  element.dispatchEvent(at("mousedown", 500));
  element.dispatchEvent(at("mousemove", 500 + distance / 2));
  element.dispatchEvent(at("mousemove", 500 + distance));
  element.dispatchEvent(at("mouseup", 500 + distance));
}

/** A one-finger swipe of `dx` / `dy` pixels, as touch events. */
export function swipeTouch(element: Element, dx: number, dy: number): void {
  const at = (type: string, x: number, y: number): Event => {
    const event = new Event(type, { bubbles: true, cancelable: true });
    const touch = { pageX: x, pageY: y, clientX: x, clientY: y };

    Object.defineProperty(event, "touches", {
      value: type === "touchend" ? [] : [touch]
    });
    Object.defineProperty(event, "changedTouches", { value: [touch] });

    return event;
  };

  element.dispatchEvent(at("touchstart", 500, 300));
  element.dispatchEvent(at("touchmove", 500 + dx / 2, 300 + dy / 2));
  element.dispatchEvent(at("touchmove", 500 + dx, 300 + dy));
  element.dispatchEvent(at("touchend", 500 + dx, 300 + dy));
}

/** A mouse drag that reports whether each move was cancelled. */
export function dragXReportingMoves(
  element: Element,
  distances: number[]
): boolean[] {
  const at = (type: string, clientX: number): MouseEvent =>
    new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY: 100
    });
  const cancelled: boolean[] = [];

  element.dispatchEvent(at("mousedown", 500));
  distances.forEach((distance) => {
    const move = at("mousemove", 500 + distance);

    element.dispatchEvent(move);
    cancelled.push(move.defaultPrevented);
  });
  element.dispatchEvent(
    at("mouseup", 500 + (distances[distances.length - 1] ?? 0))
  );

  return cancelled;
}

export function hover(element: Element, inside: boolean): void {
  const outside = element.ownerDocument.body;
  const options = { relatedTarget: outside, cancelable: true };

  element.dispatchEvent(
    new MouseEvent(inside ? "mouseover" : "mouseout", {
      ...options,
      bubbles: true
    })
  );
  element.dispatchEvent(
    new MouseEvent(inside ? "mouseenter" : "mouseleave", {
      ...options,
      bubbles: false
    })
  );
}

// --- inspection ------------------------------------------------------------------------------

/** Markup of `element`, one node per line, normalised for snapshots. */
export function markupOf(element: Element): string {
  const copy = element.cloneNode(true);

  if (!(copy instanceof Element)) {
    return "";
  }

  [copy, ...Array.from(copy.querySelectorAll("*"))].forEach((node) => {
    const attributes = Array.from(node.attributes)
      .filter(({ name, value }) => !(name === "style" && value === ""))
      .map(({ name, value }) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));

    Array.from(node.attributes).forEach(({ name }) => {
      node.removeAttribute(name);
    });
    attributes.forEach(({ name, value }) => {
      node.setAttribute(name, value);
    });
  });

  return copy.outerHTML
    .replace(/slick-slide(-control)?\d+/g, "slick-slide$1#")
    .replace(/brz-carousel(-slide)?-\d+/g, "brz-carousel$1-#")
    .replace(/></g, ">\n<");
}

export function required<T extends Element>(
  root: ParentNode,
  selector: string
): T {
  const element = root.querySelector<T>(selector);

  if (!element) {
    throw new Error(`no element matches ${selector}`);
  }

  return element;
}
