const scrollTo = (config: {
  node: HTMLElement;
  duration: number;
  onComplete?: VoidFunction;
}): void => {
  const { node, duration, onComplete } = config;
  const startLocation = window.pageYOffset;
  const windowInnerHeight = window.innerHeight;
  const bodyHeight = node.ownerDocument.body.offsetHeight;
  const endLocation = node.offsetTop;
  const distance = endLocation - startLocation;
  const increments = distance / (duration / 16);
  const direction = distance < 0 ? "toUp" : "toDown";
  let stopAnimation: undefined | VoidFunction = undefined;

  const animateScroll = (): void => {
    window.scrollBy(0, increments);
    stopAnimation?.();
  };

  const runAnimation = setInterval(animateScroll, 16);

  stopAnimation = (): void => {
    const travelled = window.pageYOffset;

    if (direction === "toDown") {
      if (
        travelled >= endLocation - increments ||
        windowInnerHeight + travelled >= bodyHeight
      ) {
        clearInterval(runAnimation);
        onComplete?.();
      }
    } else {
      if (travelled <= endLocation - increments || travelled >= startLocation) {
        clearInterval(runAnimation);
        onComplete?.();
      }
    }
  };
};

export default function($node: JQuery): void {
  const root = $node.get(0);
  const anchorSelector =
    ".brz-a[href^='#'], .brz-anchor, .link--anchor, .brz-wp-shortcode__menu .menu-item a";

  const handleGoTo = (hash: string, targetNode?: HTMLElement): void => {
    const node: HTMLElement | null = root.querySelector(hash);

    if (node) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      window.Brizy.emit("elements.anchor.startScrolled", targetNode);

      const handleComplete = (): void => {
        location.hash = hash;
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        window.Brizy.emit("elements.anchor.scrolled", targetNode);
      };

      scrollTo({ node, duration: 600, onComplete: handleComplete });
    }
  };

  // specific situation when anchor is animated
  // then go back from browser
  // we need to go on top of the page
  const handleHashChange = (): void => {
    const anchorHash = location.hash;

    if (anchorHash.trim()) {
      handleGoTo(anchorHash);

      setTimeout(() => {
        // run it a bit later also for browser compatibility
        handleGoTo(anchorHash);
      }, 1);
    } else {
      // go to top of page if don't have hash
      root.ownerDocument.documentElement.scrollTop = 0;

      setTimeout(() => {
        // run it a bit later also for browser compatibility
        root.ownerDocument.documentElement.scrollTop = 0;
      }, 1);
    }
  };

  const handleRootClick = (e: Event): void => {
    if (e.target instanceof Element) {
      const anchorNode: HTMLAnchorElement | null = e.target.closest(
        anchorSelector
      );
      const anchorHash = anchorNode?.hash.trim();

      if (anchorNode && anchorHash) {
        e.preventDefault();
        handleGoTo(anchorHash, anchorNode);
      }
    }
  };

  window.addEventListener("hashchange", handleHashChange);
  root.addEventListener("click", handleRootClick);
}
