// DOM helpers for the slider's markup work.

/** A count as the slider receives it: Ministry Brands passes the raw `data-brz-show` string. */
export type Count = number | string;

/** JavaScript's `a + b`: concatenation as soon as one side is a string. */
export const add = (a: Count, b: Count): Count =>
  typeof a === "string" || typeof b === "string" ? `${a}${b}` : a + b;

/** JavaScript's `a < b`: string order when both are strings, numeric order otherwise. */
export const lessThan = (a: Count, b: Count): boolean =>
  typeof a === "string" && typeof b === "string" ? a < b : Number(a) < Number(b);

export const greaterThan = (a: Count, b: Count): boolean => lessThan(b, a);

export const atMost = (a: Count, b: Count): boolean =>
  typeof a === "string" && typeof b === "string" ? a <= b : Number(a) <= Number(b);

export const atLeast = (a: Count, b: Count): boolean => atMost(b, a);

/** JavaScript's `a == b` between a count and a count. */
export const looselyEqual = (a: Count, b: Count): boolean =>
  typeof a === typeof b ? a === b : Number(a) === Number(b);

/** jQuery's `.eq(i)`: `+i`, counted from the end when negative. */
export function eq<T>(items: T[], index: Count): T | undefined {
  const i = Number(index);
  const at = i + (i < 0 ? items.length : 0);

  return at >= 0 && at < items.length ? items[at] : undefined;
}

/** jQuery's `.slice(start, end)`, which takes whatever `Array.prototype.slice` takes. */
export const slice = <T>(items: T[], start: Count, end?: Count): T[] =>
  items.slice(Number(start), end === undefined ? undefined : Number(end));

const HTML = /^(?:\s*(<[\w\W]+>)[^>]*)$/;

/** Whether a value is a markup string (slick's `htmlExpr`). */
export const isMarkup = (value: unknown): boolean =>
  typeof value === "string" && HTML.test(value);

/** Resolves markup, an element or nothing (`false`, `""`) to nodes. */
export function nodesOf(value: string | HTMLElement | false, doc: Document): Node[] {
  if (value instanceof HTMLElement) {
    return [value];
  }
  if (typeof value !== "string") {
    return [];
  }

  const match = HTML.exec(value);

  if (!match?.[1]) {
    return value.trim() ? Array.from(doc.querySelectorAll(value)) : [];
  }

  const template = doc.createElement("template");

  template.innerHTML = match[1];

  return Array.from(template.content.childNodes).map((node) => doc.importNode(node, true));
}

/** Parses markup into nodes (`.append(markupString)`). */
export function parse(markup: string, doc: Document): Node[] {
  const template = doc.createElement("template");

  template.innerHTML = markup;

  return Array.from(template.content.childNodes).map((node) => doc.importNode(node, true));
}

/** The elements of a node set (jQuery skips text nodes the same way). */
export const elementsOf = (nodes: Node[]): Element[] =>
  nodes.flatMap((node) => (node instanceof Element ? [node] : []));

const htmlElementsOf = (nodes: Node[]): HTMLElement[] =>
  nodes.flatMap((node) => (node instanceof HTMLElement ? [node] : []));

export function addClass(nodes: Node[], names: string): void {
  const classes = names.split(/\s+/).filter(Boolean);

  elementsOf(nodes).forEach((element) => element.classList.add(...classes));
}

export function removeClass(nodes: Node[], names: string): void {
  const classes = names.split(/\s+/).filter(Boolean);

  elementsOf(nodes).forEach((element) => element.classList.remove(...classes));
}

/** `.attr({...})`: `null` removes, anything else is written as a string. */
export function setAttributes(
  nodes: Node[],
  attributes: Record<string, string | number | null>
): void {
  elementsOf(nodes).forEach((element) => {
    Object.entries(attributes).forEach(([name, value]) => {
      if (value === null) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, String(value));
      }
    });
  });
}

export function removeAttributes(nodes: Node[], names: string): void {
  elementsOf(nodes).forEach((element) => {
    names
      .split(/\s+/)
      .filter(Boolean)
      .forEach((name) => element.removeAttribute(name));
  });
}

// --- .show() / .hide() ------------------------------------------------------------------------

const hiddenDisplay = new WeakMap<HTMLElement, string>();
const defaultDisplays = new Map<string, string>();

const displayOf = (element: HTMLElement): string =>
  (element.ownerDocument.defaultView ?? window)
    .getComputedStyle(element)
    .getPropertyValue("display");

function defaultDisplay(element: HTMLElement): string {
  const doc = element.ownerDocument;
  const known = defaultDisplays.get(element.nodeName);

  if (known) {
    return known;
  }

  const probe = doc.body.appendChild(doc.createElement(element.nodeName));
  let display = displayOf(probe);

  probe.remove();

  if (display === "none") {
    display = "block";
  }
  defaultDisplays.set(element.nodeName, display);

  return display;
}

const hiddenWithinTree = (element: HTMLElement): boolean =>
  element.style.display === "none" ||
  (element.style.display === "" &&
    element.isConnected &&
    displayOf(element) === "none");

/** `.hide()`: remembers the inline `display` and sets `none`. */
export function hide(nodes: Node[]): void {
  htmlElementsOf(nodes).forEach((element) => {
    const display = element.style.display;

    if (display !== "none") {
      hiddenDisplay.set(element, display);
      element.style.display = "none";
    }
  });
}

/** `.show()`: restores the remembered `display`, or the tag's default when a stylesheet hides it. */
export function show(nodes: Node[]): void {
  htmlElementsOf(nodes).forEach((element) => {
    let value: string | undefined;

    if (element.style.display === "none") {
      value = hiddenDisplay.get(element) || undefined;

      if (!value) {
        element.style.display = "";
      }
    }
    if (element.style.display === "" && hiddenWithinTree(element)) {
      value = defaultDisplay(element);
    }
    if (value !== undefined) {
      element.style.display = value;
    }
  });
}
