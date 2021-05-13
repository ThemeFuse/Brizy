const easeInOutQuad = (t: number, b: number, c: number, d: number): number => {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

const scrollTo = (config: {
  endLocation: number;
  duration: number;
  targetNode?: HTMLElement;
}): Promise<void> =>
  new Promise(resolve => {
    const { endLocation, duration, targetNode } = config;

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-expect-error
    window.Brizy.emit("elements.anchor.startScrolled", targetNode);

    const element = document.scrollingElement;

    if (element) {
      const startLocation = element.scrollTop;
      const distance = endLocation - startLocation;
      const increment = 20;

      let currentTime = 0;

      const animateScroll = (): void => {
        currentTime += increment;

        const val = easeInOutQuad(
          currentTime,
          startLocation,
          distance,
          duration
        );

        element.scrollTop = val;

        if (currentTime < duration) {
          setTimeout(animateScroll, increment);
        } else {
          resolve();
        }
      };

      animateScroll();
    }
  });

const getEndLocation = (
  root: HTMLElement,
  hash: string,
  scrollingElement: Element | null
): number => {
  const node: HTMLElement | null = root.querySelector(
    `[id="${hash.slice(1)}"]`
  );

  if (node && scrollingElement) {
    return node.getBoundingClientRect().top + scrollingElement.scrollTop;
  }

  return 0;
};

export default function($node: JQuery): void {
  const root = $node.get(0);
  const anchorSelector =
    ".brz-a[href^='#'], .brz-anchor, .link--anchor, .brz-menu__ul a.menu-item";

  const scrollingElement = root.ownerDocument.scrollingElement;

  // specific situation when anchor is animated
  // then go back from browser
  // we need to go on top of the page
  const handleHashChange = (e: Event): void => {
    e.preventDefault();

    const anchorHash = location.hash;

    scrollTo({
      endLocation: getEndLocation(root, anchorHash, scrollingElement),
      duration: 600
    });
  };

  const handleRootClick = (e: Event): void => {
    if (e.target instanceof Element) {
      const targetNode: HTMLAnchorElement | null = e.target.closest(
        anchorSelector
      );
      const anchorHash = targetNode?.hash.trim();

      if (targetNode && anchorHash) {
        e.preventDefault();

        const handleComplete = (): void => {
          history.pushState(null, "", anchorHash);
        };

        scrollTo({
          endLocation: getEndLocation(root, anchorHash, scrollingElement),
          duration: 600,
          targetNode
        }).then(handleComplete);
      }
    }
  };

  window.addEventListener("hashchange", handleHashChange);
  root.addEventListener("click", handleRootClick);
}
