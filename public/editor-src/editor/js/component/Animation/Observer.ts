import { mApply, MValue } from "visual/utils/value";

type Callback = (
  el: IntersectionObserverEntry,
  o: IntersectionObserver
) => void;

let observer: MValue<IntersectionObserver>;
const elements = new Map<Element, Callback>();

const handleIntersection: IntersectionObserverCallback = (items, observer) => {
  items
    .filter(({ isIntersecting }) => isIntersecting)
    .map(entry => mApply(f => f(entry, observer), elements.get(entry.target)));
};
const getObserver = (): IntersectionObserver =>
  observer ?? (observer = new IntersectionObserver(handleIntersection));

export const connect = (
  node: Element,
  callback: Callback
): IntersectionObserver => {
  if (!elements.has(node)) {
    const observer = getObserver();
    elements.set(node, callback);
    observer.observe(node);
  }

  return getObserver();
};

export const disconnect = (node: Element): void => {
  elements.delete(node);

  if (observer) {
    observer.unobserve(node);

    if (elements.size === 0) {
      observer.disconnect();
      observer = undefined;
    }
  }
};
