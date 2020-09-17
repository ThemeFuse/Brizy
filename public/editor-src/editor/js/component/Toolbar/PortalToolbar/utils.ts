import { isInsideRect } from "visual/component/Sortable/plugin/utils";

export function selectorSearchDomTree(
  node: Element,
  selector: string,
  clickEvent: MouseEvent
): Element | null {
  let target = clickEvent.target as HTMLElement | null;

  while (target && target !== node) {
    if (target.matches(selector)) {
      return target;
    }

    target = target.parentElement;
  }

  return target;
}

export function selectorSearchCoordinates(
  node: Element,
  selector: string,
  clickEvent: MouseEvent
): Element | null {
  if (
    node.matches(selector) &&
    isInsideRect(
      clickEvent.clientX,
      clickEvent.clientY,
      node.getBoundingClientRect()
    )
  ) {
    return node;
  }

  const target = node.querySelector(selector);
  if (
    target &&
    isInsideRect(
      clickEvent.clientX,
      clickEvent.clientY,
      target.getBoundingClientRect()
    )
  ) {
    return target;
  }

  return null;
}
