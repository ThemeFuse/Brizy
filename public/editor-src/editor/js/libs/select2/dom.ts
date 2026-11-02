// The DOM work select2 used to hand to jQuery, measured and handled the same way.

type Dimension = "width" | "height";
type Box = "content" | "padding" | "border";

const NON_PIXEL = /^([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))(?!px)[a-z%]+$/i;
const DISPLAY_SWAP = /^(none|table(?!-c[ea]).+)/;

const SIDES: Record<Dimension, [string, string]> = {
  width: ["right", "left"],
  height: ["top", "bottom"]
};

function computed(element: HTMLElement, name: string): string {
  const value = getComputedStyle(element).getPropertyValue(name);

  if (value === "" && !element.isConnected) {
    return element.style.getPropertyValue(name);
  }

  return value;
}

const number = (element: HTMLElement, name: string): number =>
  Number.parseFloat(computed(element, name)) || 0;

function offsetSize(element: HTMLElement, dimension: Dimension): number {
  return dimension === "width" ? element.offsetWidth : element.offsetHeight;
}

function boxAdjustment(
  element: HTMLElement,
  dimension: Dimension,
  box: Box,
  isBorderBox: boolean,
  computedValue: number
): number {
  let extra = 0;
  let delta = 0;

  if (box === (isBorderBox ? "border" : "content")) {
    return 0;
  }

  for (const side of SIDES[dimension]) {
    if (!isBorderBox) {
      delta += number(element, `padding-${side}`);

      if (box !== "padding") {
        delta += number(element, `border-${side}-width`);
      } else {
        extra += number(element, `border-${side}-width`);
      }
    } else {
      if (box === "content") {
        delta -= number(element, `padding-${side}`);
      }

      delta -= number(element, `border-${side}-width`);
    }
  }

  if (!isBorderBox && computedValue >= 0) {
    delta +=
      Math.max(
        0,
        Math.ceil(
          offsetSize(element, dimension) - computedValue - delta - extra - 0.5
        )
      ) || 0;
  }

  return delta;
}

function measure(element: HTMLElement, dimension: Dimension, box: Box): number {
  let valueIsBorderBox = computed(element, "box-sizing") === "border-box";
  let value: string | number = computed(element, dimension);

  if (NON_PIXEL.test(value)) {
    value = "auto";
  }

  if (
    (value === "auto" ||
      (!Number.parseFloat(value) &&
        computed(element, "display") === "inline")) &&
    element.getClientRects().length
  ) {
    valueIsBorderBox = true;
    value = offsetSize(element, dimension);
  }

  const size = Number.parseFloat(String(value)) || 0;

  return size + boxAdjustment(element, dimension, box, valueIsBorderBox, size);
}

// A hidden element is shown for the time of the measurement.
function size(element: HTMLElement, dimension: Dimension, box: Box): number {
  const hidden =
    DISPLAY_SWAP.test(computed(element, "display")) &&
    (!element.getClientRects().length ||
      !element.getBoundingClientRect().width);

  if (!hidden) {
    return measure(element, dimension, box);
  }

  const { position, visibility, display } = element.style;

  element.style.position = "absolute";
  element.style.visibility = "hidden";
  element.style.display = "block";

  const result = measure(element, dimension, box);

  element.style.position = position;
  element.style.visibility = visibility;
  element.style.display = display;

  return result;
}

export const outerWidth = (element: HTMLElement): number =>
  size(element, "width", "border");

export const outerHeight = (element: HTMLElement): number =>
  size(element, "height", "border");

export const innerWidth = (element: HTMLElement): number =>
  size(element, "width", "padding");

export const innerHeight = (element: HTMLElement): number =>
  size(element, "height", "padding");

export const contentWidth = (element: HTMLElement): number =>
  size(element, "width", "content");

export const viewportHeight = (): number =>
  document.documentElement.clientHeight;

export const pageScrollTop = (): number => window.pageYOffset;

interface Offset {
  top: number;
  left: number;
}

// The position on the page, not in the viewport.
export function offset(element: Element): Offset {
  if (!element.getClientRects().length) {
    return { top: 0, left: 0 };
  }

  const rect = element.getBoundingClientRect();
  const view = element.ownerDocument.defaultView ?? window;

  return {
    top: rect.top + view.pageYOffset,
    left: rect.left + view.pageXOffset
  };
}

export const cssPosition = (element: HTMLElement): string =>
  computed(element, "position");

// The closest positioned ancestor, or the document element.
export function offsetParent(element: HTMLElement): HTMLElement {
  let parent = element.offsetParent;

  while (
    parent instanceof HTMLElement &&
    computed(parent, "position") === "static"
  ) {
    parent = parent.offsetParent;
  }

  return parent instanceof HTMLElement ? parent : document.documentElement;
}

export const px = (value: number): string => `${value}px`;

const BRACES = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;

function convert(data: string): unknown {
  if (data === "true") {
    return true;
  }

  if (data === "false") {
    return false;
  }

  if (data === "null") {
    return undefined;
  }

  if (data === `${+data}`) {
    return +data;
  }

  if (BRACES.test(data)) {
    return JSON.parse(data);
  }

  return data;
}

// A `data-*` attribute with its value read as a boolean, a number or json when it looks like one.
export function dataAttr(element: Element, name: string): unknown {
  const data = element.getAttribute(`data-${name}`);

  if (data === null) {
    return undefined;
  }

  try {
    return convert(data);
  } catch {
    return data;
  }
}

const MARKUP = /<|&#?\w+;/;

// Adds a string the way an html fragment is added: text stays text, markup is parsed.
export function appendMarkup(parent: Element, markup: string): void {
  if (markup === "") {
    return;
  }

  if (!MARKUP.test(markup)) {
    parent.append(document.createTextNode(markup));
    return;
  }

  const holder = document.createElement("div");
  holder.innerHTML = markup;
  parent.append(...holder.childNodes);
}

export function appendContent(
  parent: Element,
  content: HTMLElement | string
): void {
  if (typeof content === "string") {
    appendMarkup(parent, content);
  } else {
    parent.append(content);
  }
}

type DelegatedHandler<E> = (event: E, current: HTMLElement) => void;

interface Queued<E> {
  current: HTMLElement;
  handlers: Array<DelegatedHandler<E>>;
}

// One native listener per element and event: delegated handlers first, from the target up, then direct ones.
export class Hub<E extends Event> {
  private delegated: Array<{ selector: string; handler: DelegatedHandler<E> }> =
    [];
  private direct: Array<DelegatedHandler<E>> = [];
  private stopped = false;

  constructor(private root: HTMLElement) {}

  on(handler: (event: E) => void): void {
    this.direct.push(handler);
  }

  delegate(selector: string, handler: DelegatedHandler<E>): void {
    this.delegated.push({ selector, handler });
  }

  off(handler: DelegatedHandler<E>): void {
    this.delegated = this.delegated.filter((item) => item.handler !== handler);
    this.direct = this.direct.filter((item) => item !== handler);
  }

  // Keeps the handlers further up, and the direct ones, from running.
  stop(event: E): void {
    this.stopped = true;
    event.stopPropagation();
  }

  dispatch = (event: E): void => {
    const queue: Array<Queued<E>> = [];
    const isClick = event.type === "click";
    const secondary =
      isClick && event instanceof MouseEvent && event.button >= 1;

    if (this.delegated.length && !secondary) {
      let current = event.target;

      while (current instanceof Node && current !== this.root) {
        if (
          current instanceof HTMLElement &&
          !(isClick && current instanceof HTMLInputElement && current.disabled)
        ) {
          const element = current;
          const handlers = this.delegated
            .filter(({ selector }) => element.matches(selector))
            .map(({ handler }) => handler);

          if (handlers.length) {
            queue.push({ current: element, handlers });
          }
        }

        current = current.parentNode ?? this.root;
      }
    }

    if (this.direct.length) {
      queue.push({ current: this.root, handlers: [...this.direct] });
    }

    this.stopped = false;

    for (const { current, handlers } of queue) {
      if (this.stopped) {
        break;
      }

      for (const handler of handlers) {
        handler(event, current);
      }
    }
  };
}

export function hub<K extends keyof HTMLElementEventMap>(
  root: HTMLElement,
  type: K
): Hub<HTMLElementEventMap[K]> {
  const created = new Hub<HTMLElementEventMap[K]>(root);

  root.addEventListener(type, created.dispatch);

  return created;
}

interface FocusHub {
  hub: Hub<FocusEvent>;
  dispose: VoidFunction;
}

// `focusin` and `focusout` under the root, heard as `focus` and `blur` caught on the document.
export function focusHub(root: HTMLElement, type: "focus" | "blur"): FocusHub {
  const created = new Hub<FocusEvent>(root);
  const listener = (event: FocusEvent): void => {
    if (event.target instanceof Node && root.contains(event.target)) {
      created.dispatch(event);
    }
  };

  root.ownerDocument.addEventListener(type, listener, true);

  return {
    hub: created,
    dispose: () => {
      root.ownerDocument.removeEventListener(type, listener, true);
    }
  };
}
