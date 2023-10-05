type Emit = (width: number) => void;

const nodeStack = new Map<HTMLElement, Emit>();
let resizeTimer: NodeJS.Timer;

const triggerNodes = (): void => {
  const { innerWidth } = window;

  nodeStack.forEach((nodeCb) => {
    nodeCb(innerWidth);
  });
};

const handleResize = (): void => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(triggerNodes, 250);
};

export const attachResize = (node: HTMLElement, cb: Emit): void => {
  if (nodeStack.size === 0) {
    window.addEventListener("resize", handleResize);
  }

  nodeStack.set(node, cb);
};

export const detachResize = (node: HTMLElement): void => {
  nodeStack.delete(node);

  if (nodeStack.size === 0) {
    window.removeEventListener("resize", handleResize);
  }
};
