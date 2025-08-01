import { isFunction } from "es-toolkit";
import type { MValue } from "visual/utils/value";
import type { ObserverCallback } from "./types";

const stack = new Map<HTMLElement, ObserverCallback>();
let resizeObserver: MValue<ResizeObserver>;

export const observe = (
  node: HTMLElement,
  callback: ObserverCallback
): void => {
  if (resizeObserver === undefined) {
    resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const node = entry.target as HTMLElement;
        const callback = stack.get(node);

        if (isFunction(callback)) {
          callback(entry);
        }
      });
    });
  }

  const wasObserved = stack.has(node);

  if (!wasObserved) {
    stack.set(node, callback);
    resizeObserver.observe(node);
  }
};

export const unobserve = (node: HTMLElement): void => {
  stack.delete(node);
  resizeObserver?.unobserve(node);
};
