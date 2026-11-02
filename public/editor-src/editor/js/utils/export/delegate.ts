// The elements from the event target up to the root that match the selector, innermost first.
export function delegatedTargets<T extends Element>(
  root: Element,
  event: Event,
  selector: string
): T[] {
  const candidates = [...root.querySelectorAll<T>(selector)];
  const targets: T[] = [];
  let current = event.target;

  while (current instanceof Node && current !== root) {
    const node = current;
    const match = candidates.find((candidate) => candidate === node);

    if (match) {
      targets.push(match);
    }

    current = node.parentNode ?? root;
  }

  return targets;
}

export interface ClickRule {
  selector: string;
  handler: (element: Element, event: MouseEvent) => void;
}

// One capturing click listener on body, so no ancestor can stop the click first; a rule gets the element nearest to the click that matches its selector.
export function onBodyClick(rules: ClickRule[]): void {
  const { body } = document;

  body.addEventListener(
    "click",
    (event) => {
      const path = event.composedPath();

      rules.forEach(({ selector, handler }) => {
        for (const node of path) {
          if (node === body) {
            return;
          }

          if (node instanceof Element && node.matches(selector)) {
            handler(node, event);
            return;
          }
        }
      });
    },
    true
  );
}
