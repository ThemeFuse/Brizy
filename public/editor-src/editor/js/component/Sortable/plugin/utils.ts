import { Rect } from "./types";

// DOM

export const events = {
  start: ["mousedown"],
  move: ["mousemove"],
  end: ["mouseup"]
} as const;

export function closest(
  el: Element,
  fn: (el: Element) => boolean
): Element | undefined {
  let el_: Element | null = el;

  while (el_) {
    if (fn(el_)) {
      return el_;
    }

    el_ = el_.parentElement;
  }
}

export function elementDepth(el: Element): number {
  let el_: Element | null = el;
  let depth = 0;

  while ((el_ = el_.parentElement)) {
    depth++;
  }

  return depth;
}

export function elementIndex(el: Element): number {
  const parent = el.parentElement;

  return parent ? Array.from(parent.children).indexOf(el) : -1;
}

export function addClass(el: Element, ...classNames: string[]): void {
  classNames.filter(String).forEach(className => el.classList.add(className));
}

export function removeClass(el: Element, ...classNames: string[]): void {
  classNames.forEach(className => el.classList.remove(className));
}

// Math

export function pointDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;

  return Math.sqrt(dx * dx + dy * dy);
}

export function pointRelative(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): { isAbove: boolean; isBelow: boolean; isLeft: boolean; isRight: boolean } {
  const isAbove = y1 < y2;
  const isBelow = !isAbove;
  const isLeft = x1 < x2;
  const isRight = !isLeft;

  return { isAbove, isBelow, isLeft, isRight };
}

export function isInsideRect(x: number, y: number, rect: Rect): boolean {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

export function rectCenter(rect: Rect): { x: number; y: number } {
  return {
    x: rect.left + (rect.right - rect.left) * 0.5,
    y: rect.top + (rect.bottom - rect.top) * 0.5
  };
}

export function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}
