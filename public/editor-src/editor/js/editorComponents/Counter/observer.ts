import type { CounterData } from "./types";
import { animate, compareNodes } from "./utils.export";

const counters: CounterData[] = [];

const handleObserve = (entries: IntersectionObserverEntry[]): void => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const target = <HTMLElement>entry.target;

      const node = counters.find(compareNodes(target));
      const index = counters.findIndex(compareNodes(target));

      if (node && index !== -1 && !counters[index].wasAnimated) {
        animate(node);
        counters[index].wasAnimated = true;
      }
    }
  });
};

const observer = new IntersectionObserver(handleObserve, {
  root: null,
  threshold: 1
});

export const observe = (data: CounterData): void => {
  counters.push(data);
  observer.observe(data.elem);
};
