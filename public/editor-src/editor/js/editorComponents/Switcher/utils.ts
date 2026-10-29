export const find = (node: Element, selector: string): Element[] =>
  Array.from(node.querySelectorAll(selector));

export const toggleClass = (nodes: Element[], className: string): void => {
  nodes.forEach((node) => {
    node.classList.toggle(className);
  });
};
