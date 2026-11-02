// Test-only helpers: jsdom has no layout and focuses hidden elements, so sizes are stubbed and keys go to an explicit target.

import { z } from "zod";

const elementSchema = z.instanceof(HTMLElement);
const selectSchema = z.instanceof(HTMLSelectElement);
const inputSchema = z.instanceof(HTMLInputElement);

export function query(root: ParentNode, selector: string): HTMLElement {
  return elementSchema.parse(root.querySelector(selector));
}

// For nodes that are not HTML elements, like an svg icon.
export function queryNode(root: ParentNode, selector: string): Element {
  return z.instanceof(Element).parse(root.querySelector(selector));
}

export function queryAll(root: ParentNode, selector: string): HTMLElement[] {
  return z.array(elementSchema).parse([...root.querySelectorAll(selector)]);
}

export function querySelect(
  root: ParentNode,
  selector: string
): HTMLSelectElement {
  return selectSchema.parse(root.querySelector(selector));
}

export function queryInput(
  root: ParentNode,
  selector: string
): HTMLInputElement {
  return inputSchema.parse(root.querySelector(selector));
}

export function mount(html: string): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = html;
  document.body.append(root);

  return root;
}

// One node per line, so a snapshot diff names the node that changed.
export const markupOf = (element: Element): string =>
  element.outerHTML.replace(/></g, ">\n<");

export const textsOf = (root: ParentNode, selector: string): string[] =>
  queryAll(root, selector).map((node) => node.textContent ?? "");

const KEY_CODES = {
  Backspace: 8,
  Tab: 9,
  Enter: 13,
  Shift: 16,
  Escape: 27,
  " ": 32,
  ArrowUp: 38,
  ArrowDown: 40,
  a: 65
} as const;

export type KeyName = keyof typeof KEY_CODES;

export interface Modifiers {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

export const NO_MODIFIERS: Modifiers = {
  altKey: false,
  ctrlKey: false,
  metaKey: false
};

function keyEvent(
  type: "keydown" | "keyup",
  target: Element,
  key: KeyName,
  modifiers: Modifiers
): KeyboardEvent {
  const event = new KeyboardEvent(type, {
    key,
    keyCode: KEY_CODES[key],
    which: KEY_CODES[key],
    bubbles: true,
    cancelable: true,
    ...modifiers
  });
  target.dispatchEvent(event);

  return event;
}

export const keyDown = (
  target: Element,
  key: KeyName,
  modifiers: Modifiers
): KeyboardEvent => keyEvent("keydown", target, key, modifiers);

export const keyUp = (
  target: Element,
  key: KeyName,
  modifiers: Modifiers
): KeyboardEvent => keyEvent("keyup", target, key, modifiers);

function mouseEvent(
  type: string,
  target: Element,
  bubbles: boolean,
  modifiers: Modifiers
): MouseEvent {
  const event = new MouseEvent(type, {
    bubbles,
    cancelable: true,
    button: 0,
    which: 1,
    ...modifiers
  });
  target.dispatchEvent(event);

  return event;
}

export const mouseDown = (target: Element): MouseEvent =>
  mouseEvent("mousedown", target, true, NO_MODIFIERS);

export const mouseUp = (target: Element, modifiers: Modifiers): MouseEvent =>
  mouseEvent("mouseup", target, true, modifiers);

export const click = (target: Element): MouseEvent =>
  mouseEvent("click", target, true, NO_MODIFIERS);

// What a browser sends when the pointer moves onto an element.
export function hover(target: Element): void {
  mouseEvent("mouseover", target, true, NO_MODIFIERS);
  mouseEvent("mouseenter", target, false, NO_MODIFIERS);
}

// Typing replaces the value and fires the `input` a browser fires.
export function type(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

export const nextFrame = (): Promise<void> =>
  new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });

export const nextTimers = async (): Promise<void> => {
  for (let turn = 0; turn < 3; turn++) {
    await new Promise((resolve) => setTimeout(resolve, 2));
  }
};

export interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface LayoutRule {
  selector: string;
  position: "static" | "relative" | "absolute";
  box: Box;
}

export interface Viewport {
  height: number;
  scrollTop: number;
}

const LAYOUT_STYLE_ID = "select2-test-layout";

// Gives the matched elements a size and a position through every source a measurement reads.
export function stubLayout(rules: LayoutRule[], viewport: Viewport): void {
  document.getElementById(LAYOUT_STYLE_ID)?.remove();

  const style = document.createElement("style");
  style.id = LAYOUT_STYLE_ID;
  style.textContent = rules
    .map(
      ({ selector, position, box }) =>
        `${selector} { display: block; position: ${position}; width: ${box.width}px; height: ${box.height}px; }`
    )
    .join("\n");
  document.head.append(style);

  const boxOf = (element: Element): Box | undefined =>
    rules.find(({ selector }) => element.matches(selector))?.box;

  jest
    .spyOn(Element.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: Element) {
      const box = boxOf(this) ?? { top: 0, left: 0, width: 0, height: 0 };
      const top = box.top - viewport.scrollTop;

      return new DOMRect(box.left, top, box.width, box.height);
    });

  const noRects = document.createElement("div").getClientRects();

  jest.spyOn(Element.prototype, "getClientRects").mockImplementation(function (
    this: Element
  ) {
    const box = boxOf(this);

    if (!box) {
      return noRects;
    }

    const rect = new DOMRect(
      box.left,
      box.top - viewport.scrollTop,
      box.width,
      box.height
    );

    return Object.assign(Object.create(Object.getPrototypeOf(noRects)), {
      0: rect,
      length: 1
    });
  });

  jest
    .spyOn(HTMLElement.prototype, "offsetWidth", "get")
    .mockImplementation(function (this: HTMLElement) {
      return boxOf(this)?.width ?? 0;
    });

  jest
    .spyOn(HTMLElement.prototype, "offsetHeight", "get")
    .mockImplementation(function (this: HTMLElement) {
      return boxOf(this)?.height ?? 0;
    });

  Object.defineProperty(document.documentElement, "clientHeight", {
    configurable: true,
    value: viewport.height
  });
  Object.defineProperty(window, "pageYOffset", {
    configurable: true,
    value: viewport.scrollTop
  });
}

function releaseLayout(): void {
  document.getElementById(LAYOUT_STYLE_ID)?.remove();
  Reflect.deleteProperty(document.documentElement, "clientHeight");
  Object.defineProperty(window, "pageYOffset", {
    configurable: true,
    value: 0
  });
}

// Every generated id character is the same, so ids are stable across runs.
export function fixRandom(): void {
  jest.spyOn(Math, "random").mockReturnValue(0.5);
}

export function clearPage(): void {
  document.body.innerHTML = "";
  document.head.innerHTML = "";
  releaseLayout();
}

// jsdom has no `scrollIntoView`; the accessibility helpers call it.
export function stubScrollIntoView(): void {
  Object.defineProperty(Element.prototype, "scrollIntoView", {
    configurable: true,
    writable: true,
    value: jest.fn()
  });
}

// A press anywhere outside closes every open dropdown.
export function pressOutside(): void {
  document.body.dispatchEvent(
    new MouseEvent("mousedown", { bubbles: true, cancelable: true, which: 1 })
  );
}
