type Emit = (e: Event) => void;

const nodeStack = new Map<HTMLElement, Emit>();

const handleWheel = (e: Event) => {
  const count = nodeStack.size;
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
