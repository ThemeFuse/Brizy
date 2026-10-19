const SCROLL_DURATION = 200;
const scrollQueue: number[] = [];

export const children = (node: Element, selector: string): Element[] =>
  Array.from(node.children).filter((child) => child.matches(selector));

export const siblings = (node: Element): Element[] =>
  Array.from(node.parentNode?.children ?? []).filter(
    (sibling) => sibling !== node
  );

export const indexOf = (node: Element | undefined): number =>
  node?.parentNode ? Array.from(node.parentNode.children).indexOf(node) : -1;

export const getTabsContent = (tabs: Element): Element[] =>
  children(tabs, ".brz-tabs__content").flatMap((content) =>
    children(content, ".brz-tabs__items")
  );

export const getOffsetTop = (node: Element): number =>
  node.getClientRects().length
    ? node.getBoundingClientRect().top + window.pageYOffset
    : 0;

export const getInnerHeight = (node: Element): number => {
  const styles = getComputedStyle(node);
  const px = (name: string): number =>
    parseFloat(styles.getPropertyValue(name)) || 0;

  return styles.boxSizing === "border-box"
    ? px("height") - px("border-top-width") - px("border-bottom-width")
    : px("height") + px("padding-top") + px("padding-bottom");
};

function runScroll(): void {
  const scrollTop = scrollQueue[0];
  const nodes = [document.documentElement, document.body];
  const starts = nodes.map((node) => node.scrollTop);
  const startTime = Date.now();

  const tick = (): void => {
    const percent = Math.min(1, (Date.now() - startTime) / SCROLL_DURATION);
    const eased = 0.5 - Math.cos(percent * Math.PI) / 2;

    nodes.forEach((node, index) => {
      node.scrollTop = starts[index] + (scrollTop - starts[index]) * eased;
    });

    if (percent < 1) {
      requestAnimationFrame(tick);
    } else {
      scrollQueue.shift();

      if (scrollQueue.length) {
        runScroll();
      }
    }
  };

  requestAnimationFrame(tick);
}

// scrolls run one after another
export function animateScrollTop(scrollTop: number): void {
  scrollQueue.push(scrollTop);

  if (scrollQueue.length === 1) {
    runScroll();
  }
}
