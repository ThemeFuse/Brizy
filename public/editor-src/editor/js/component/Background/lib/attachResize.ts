type Emit = (e: Event) => void;

const nodeStack = new Map<HTMLElement, Emit>();

const handleResize = (e: Event) => {
  nodeStack.forEach((nodeCb) => {
    nodeCb(e);
  });
};

export const attachResize = (element: HTMLElement, cb: Emit): void => {
  if (nodeStack.size) {
    nodeStack.set(element, cb);
  } else {
    window.addEventListener("resize", handleResize, { passive: false });
    nodeStack.set(element, cb);
  }
};

export const detachResize = (element: HTMLElement): void => {
  nodeStack.delete(element);

  if (nodeStack.size === 0) {
    window.removeEventListener("resize", handleResize);
  }
};
