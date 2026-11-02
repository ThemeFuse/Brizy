import { innerHeight, innerWidth } from "./dom";
import type { DataItem, Placeholder } from "./types";

export function generateChars(length: number): string {
  let chars = "";

  for (let i = 0; i < length; i++) {
    const randomChar = Math.floor(Math.random() * 36);
    chars += randomChar.toString(36);
  }

  return chars;
}

export function hasScroll(el: HTMLElement): boolean {
  const overflowX = el.style.overflowX;
  const overflowY = el.style.overflowY;

  if (
    overflowX === overflowY &&
    (overflowY === "hidden" || overflowY === "visible")
  ) {
    return false;
  }

  if (overflowX === "scroll" || overflowY === "scroll") {
    return true;
  }

  return innerHeight(el) < el.scrollHeight || innerWidth(el) < el.scrollWidth;
}

const ESCAPES: Record<string, string> = {
  "\\": "&#92;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#47;"
};

export function escapeMarkup(markup: string): string {
  return markup.replace(/[&<>"'/\\]/g, (match) => ESCAPES[match]);
}

interface ScrollPosition {
  y: number;
}

let lastId = 0;

// Stamps the element with `data-select2-id` the first time it is asked about.
function uniqueElementId(element: Element): string {
  const select2Id = element.getAttribute("data-select2-id");

  if (select2Id !== null) {
    return select2Id;
  }

  if (element.id) {
    element.setAttribute("data-select2-id", element.id);

    return element.id;
  }

  lastId++;
  element.setAttribute("data-select2-id", String(lastId));

  return String(lastId);
}

const stores: Array<Map<string, unknown>> = [];

// What select2 remembers about elements, under the id it stamps on them.
interface Store<T> {
  set: (element: Element, value: T) => void;
  get: (element: Element) => T | undefined;
}

export function createStore<T>(): Store<T> {
  const values = new Map<string, T>();

  stores.push(values);

  return {
    set: (element, value) => {
      values.set(uniqueElementId(element), value);
    },
    get: (element) => values.get(uniqueElementId(element))
  };
}

export const itemStore = createStore<DataItem>();

export const oldTabindexStore = createStore<string | number>();

export const scrollPositionStore = createStore<ScrollPosition>();

export function removeData(element: Element): void {
  const id = uniqueElementId(element);

  stores.forEach((values) => values.delete(id));
  element.removeAttribute("data-select2-id");
}

// A text placeholder stands for the option without a value; anything else is taken as given.
export function normalizePlaceholder(placeholder: unknown): Placeholder {
  if (typeof placeholder === "string") {
    return { id: "", text: placeholder };
  }

  return {
    id: Reflect.get(Object(placeholder), "id"),
    text: Reflect.get(Object(placeholder), "text")
  };
}
