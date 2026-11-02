import { tween } from "./tween";
import type { CounterData } from "./types";
import { formatNumber } from "./utils";

export const compareNodes = (node: HTMLElement) => (counter: CounterData) =>
  counter.elem.isEqualNode(node);

export const animate = (value: CounterData): void => {
  const { elem, separator } = value;

  const figures = elem.querySelector(
    ".brz-counter-figures .brz-counter-numbers"
  );
  const chart = elem.querySelector<HTMLElement>(".brz-counter-pie-chart");

  if (figures) {
    const step = (countNum: number) => {
      figures.textContent = formatNumber(countNum, separator);

      if (chart) {
        chart.style.strokeDasharray = `${countNum + 0.5} 100`;
      }
    };

    tween({
      start: value.start,
      end: value.end,
      duration: value.duration * 1000,
      step,
      complete: () => {
        step(value.end);
      }
    });
  }
};
