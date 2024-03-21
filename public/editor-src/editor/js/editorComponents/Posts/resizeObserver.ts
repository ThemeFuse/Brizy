const nodes: Map<Element, VoidFunction> = new Map();
let resizeObserver: ResizeObserver | null = null;

const handleResize = (entries: ResizeObserverEntry[]) => {
  entries.forEach((entry) => {
    const node = entry.target;
    const callback = nodes.get(node);
    if (typeof callback === "function") {
      callback();
    }
  });
};

export const observe = (node: Element, callback: VoidFunction) => {
  if (
    window &&
    typeof window.ResizeObserver === "function" &&
    !resizeObserver
  ) {
    resizeObserver = new ResizeObserver(handleResize);
  }

  if (!nodes.has(node) && resizeObserver) {
    nodes.set(node, callback);
    resizeObserver.observe(node);
  }
};

export const disconnect = (node: Element) => {
  if (nodes.has(node) && resizeObserver) {
    nodes.delete(node);
    resizeObserver.unobserve(node);
  }

  if (nodes.size === 0) {
    resizeObserver?.disconnect();
    resizeObserver = null;
  }
};
