import { throttle } from "es-toolkit";
import { hasScroll } from "./utils";

type Emit = (e: Event) => void;

const nodeStack = new Map<HTMLElement, Emit>();

// Throttle the hasScroll check and return the result via the provided callback
const throttledHasScroll = throttle(
  (element: HTMLElement, cb: (v: boolean) => void) => {
    cb(hasScroll(element));
  },
  1000
);

const handleWheel = (e: Event) => {
  const count = nodeStack.size;
  const element = e.target instanceof HTMLElement ? e.target : null;
  let hasScroll = true;
  const setHasScroll = (v: boolean) => (hasScroll = v);

  element && throttledHasScroll(element, setHasScroll);

  if (hasScroll) {
    return;
  }

  const [_, nodeCb] = [...nodeStack][count - 1]; // eslint-disable-line @typescript-eslint/no-unused-vars
  nodeCb?.(e);
};

export const attachWheel = (element: HTMLElement, cb: Emit): void => {
  if (nodeStack.size) {
    nodeStack.set(element, cb);
  } else {
    window.addEventListener("wheel", handleWheel, { passive: false });
    nodeStack.set(element, cb);
  }
};

export const detachWheel = (element: HTMLElement): void => {
  nodeStack.delete(element);

  if (nodeStack.size === 0) {
    window.removeEventListener("wheel", handleWheel);
  }
};
