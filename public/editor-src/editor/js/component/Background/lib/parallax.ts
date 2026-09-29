import { attachResize, detachResize } from "./attachResize";
import { attachWheel, detachWheel } from "./attachWheel";
import { height, offsetTop, outerHeight } from "./dimensions";

// The parallax effect behind `.brz-bg`: it profiles the image holders once, translates them on
// every scrolled frame, and hijacks the wheel to drive an inertial scroll of its own. Ported from
// the in-house jQuery plugin it replaces, behaviour for behaviour — including the bits below that
// look like oversights, which are kept on purpose (BRZ-1391 rewrites, it does not fix):
//
//  - the animation frame loop is never cancelled, not even by `destroy`;
//  - `destroy` leaves the inline height it wrote on an image it can no longer see;
//  - a resize only rewrites that height while the container is still taller than the viewport.

const INIT_CLASS = "brz-bg-image-parallax--init";

// Easing constants of the inertial scroll: total distance, minimum step worth scrolling, and the
// number of frames a single wheel notch is spread over.
const DISTANCE = 300;
const MIN_STEP = 1;
const FRAMES = 30;
const WHEEL_START_FRAME = 4;
const MAX_SPEED = 2;

export interface ParallaxOptions {
  /** The class of the image holders inside the container. */
  bgClass: string;
  /** Targets whose wheel events the parallax must not swallow — editor chrome only. */
  wheelIgnoreClass: string[];
}

interface Item {
  top: number;
  bottom: number;
  imageHolder: HTMLElement;
}

const instances = new WeakMap<HTMLElement, Parallax>();

/** Starts the parallax on a container, unless it is already running on it. */
export function initParallax(
  element: HTMLElement,
  options: ParallaxOptions
): void {
  if (!instances.has(element)) {
    instances.set(element, new Parallax(element, options));
  }
}

/** Stops the parallax and undoes what it wrote. Does nothing if it was not running. */
export function destroyParallax(element: HTMLElement): void {
  const instance = instances.get(element);

  if (instance) {
    instance.destroy();
    instances.delete(element);
  }
}

/** Detaches or re-attaches the listeners without losing the profile. */
export function pauseParallax(element: HTMLElement, paused: boolean): void {
  instances.get(element)?.paused(paused);
}

class Parallax {
  private readonly element: HTMLElement;
  private readonly options: ParallaxOptions;

  private items: Item[] = [];
  private windowHeight = 0;
  private scrolled = false;
  private wheeling = false;
  private speed = 0;
  private frame = 0;

  private readonly onScroll = (): void => {
    this.scrolled = true;
  };

  private readonly onWheel = (event: Event): void => {
    this.handleWheel(event);
  };

  private readonly onResize = (): void => {
    this.windowHeight = viewportHeight();
    this.profile();
  };

  constructor(element: HTMLElement, options: ParallaxOptions) {
    this.element = element;
    this.options = options;
    this.windowHeight = viewportHeight();

    this.profile();
    this.attachEvents();
    this.tick();
  }

  destroy(): void {
    this.detachEvents();

    for (const holder of this.holders()) {
      holder.style.height = "";
      holder.style.transform = "";
      holder.classList.remove(INIT_CLASS);
    }
  }

  paused(paused: boolean): void {
    if (paused) {
      this.detachEvents();
    } else {
      this.attachEvents();
    }
  }

  private holders(): HTMLElement[] {
    return [
      ...this.element.querySelectorAll<HTMLElement>(`.${this.options.bgClass}`)
    ];
  }

  private attachEvents(): void {
    window.addEventListener("scroll", this.onScroll, false);
    attachWheel(this.element, this.onWheel);
    attachResize(this.element, this.onResize);
  }

  private detachEvents(): void {
    window.removeEventListener("scroll", this.onScroll, false);
    detachWheel(this.element);
    detachResize(this.element);
  }

  private profile(): void {
    this.items = [];

    for (const holder of this.holders()) {
      const top = offsetTop(this.element);
      const difference = this.heightRatio();

      if (difference !== undefined) {
        this.setHolderHeights(difference);
      }

      this.items.push({
        top,
        bottom: top + outerHeight(this.element),
        imageHolder: holder
      });

      holder.classList.add(INIT_CLASS);
      translate(holder, (scrollTop() + this.windowHeight - top) / 2);
    }
  }

  // How many viewports tall the container is, or `undefined` while it fits inside one.
  private heightRatio(): number | undefined {
    const viewport = document.documentElement.clientHeight;
    const elementHeight = height(this.element);

    return elementHeight > viewport ? elementHeight / viewport : undefined;
  }

  private setHolderHeights(difference: number): void {
    for (const holder of this.holders()) {
      holder.style.height = `${100 * difference}vh`;
    }
  }

  private handleWheel(event: Event): void {
    const { wheelIgnoreClass } = this.options;

    if (
      wheelIgnoreClass.length > 0 &&
      event.target instanceof Element &&
      event.target.closest(`.${wheelIgnoreClass.join(", .")}`) !== null
    ) {
      return;
    }

    event.preventDefault();

    this.speed = clamp(wheelSpeed(event));
    this.wheeling = true;
    this.frame = WHEEL_START_FRAME;
  }

  private move(item: Item, scroll: number): void {
    if (scroll + this.windowHeight > item.top && scroll < item.bottom) {
      translate(item.imageHolder, (scroll + this.windowHeight - item.top) / 2);
    }
  }

  private tick(): void {
    let step = 0;

    if (this.scrolled) {
      const scroll = scrollTop();

      for (let index = this.items.length; index--; ) {
        this.move(this.items[index], scroll);
      }

      this.scrolled = false;
    }

    if (this.wheeling) {
      step += -this.speed * ease(this.frame);

      if (step > MIN_STEP || -MIN_STEP > step) {
        window.scrollBy(0, Math.round(step));
        step = 0;
      }

      this.frame++;

      if (this.frame > FRAMES) {
        this.frame = 0;
        this.wheeling = false;
        this.speed = 0;
      }
    }

    // Deliberately unconditional: the loop outlives `destroy`, exactly as it did before.
    window.requestAnimationFrame(() => this.tick());
  }
}

// The distance covered by one frame of a quintic ease-out, as the difference between this frame's
// and the previous frame's position along it.
function ease(frame: number): number {
  const previous = (frame - 1) / FRAMES - 1;
  const current = frame / FRAMES - 1;

  return DISTANCE * (current ** 5 + 1) - DISTANCE * (previous ** 5 + 1);
}

function wheelSpeed(event: Event): number {
  if ("notRealWheel" in event && event.notRealWheel) {
    return -deltaY(event) / 4;
  }

  if (event instanceof WheelEvent && event.deltaMode === 1) {
    return -deltaY(event) / 3;
  }

  if (Math.abs(deltaY(event)) === 100) {
    return -deltaY(event) / 120;
  }

  return -deltaY(event) / 40;
}

const deltaY = (event: Event): number =>
  event instanceof WheelEvent ? event.deltaY : 0;

const clamp = (speed: number): number =>
  Math.min(MAX_SPEED, Math.max(-MAX_SPEED, speed));

const viewportHeight = (): number =>
  Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

const scrollTop = (): number =>
  document.documentElement.scrollTop === 0
    ? document.body.scrollTop
    : document.documentElement.scrollTop;

// Every browser the preview bundle targets has the unprefixed property; the plugin's probe over
// the vendor-prefixed names always resolved to this one.
const translate = (element: HTMLElement, y: number): void => {
  element.style.transform = `translate3d(0,${y}px,0)`;
};
