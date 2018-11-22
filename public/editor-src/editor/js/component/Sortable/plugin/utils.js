// DOM

export const events = {
  start: ["mousedown"],
  move: ["mousemove"],
  end: ["mouseup"]
};

export function closest(el, fn) {
  while (el) {
    if (fn(el)) return el;
    el = el.parentElement;
  }
}

export function nodeIndex(node) {
  return Array.prototype.indexOf.call(node.parentNode.children, node);
}

export function nodeDepth(node) {
  let depth = 0;

  while ((node = node.parentElement)) {
    depth++;
  }

  return depth;
}

export function addClass(node, ...classNames) {
  classNames.filter(String).forEach(className => node.classList.add(className));
}

export function removeClass(node, ...classNames) {
  classNames.forEach(className => node.classList.remove(className));
}

export function hasClass(node, className) {
  return node.classList.contains(className);
}

// Math

export function pointDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  return Math.sqrt(dx * dx + dy * dy);
}

export function pointRelative(x1, y1, x2, y2) {
  const isAbove = y1 < y2;
  const isBelow = !isAbove;
  const isLeft = x1 < x2;
  const isRight = !isLeft;

  return { isAbove, isBelow, isLeft, isRight };
}

export function isInsideRect(x, y, rect) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

export function rectCenter(rect) {
  return {
    x: rect.left + (rect.right - rect.left) * 0.5,
    y: rect.top + (rect.bottom - rect.top) * 0.5
  };
}

export function clamp(value, min, max) {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

// Array

export function find(arr, fn) {
  return Array.prototype.find.call(arr, fn);
}

export function isArray(something) {
  return Array.isArray(something);
}

export function toArray(arrayLike) {
  return Array.from(arrayLike);
}
