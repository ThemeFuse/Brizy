import { isFunction } from "es-toolkit";
import { makeDataAttrString } from "visual/utils/i18n/attribute";
import { easeInOutQuad, toSamePage } from "./utils";

const scrollTo = (config: {
  endLocation: number | (() => number);
  duration: number;
  targetNode?: HTMLElement;
}): Promise<void> =>
  new Promise((resolve) => {
    const { endLocation: _endLocation, duration, targetNode } = config;

    window.Brz.emit("elements.anchor.startScrolled", targetNode);

    const element = document.scrollingElement;

    if (element) {
      const startLocation = element.scrollTop;
      const increment = 20;

      let currentTime = 0;

      const animateScroll = (): void => {
        const endLocation = isFunction(_endLocation)
          ? _endLocation()
          : _endLocation;
        const distance = endLocation - startLocation;

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

export default function ($node: JQuery): void {
  const root = $node.get(0);
  if (!root) return;
  const anchorSelector =
    ".brz-a:not([data-brz-link-type='popup']), .brz-anchor, .link--anchor, .link--external, .brz-menu__ul a.menu-item";

  const scrollingElement = root.ownerDocument.scrollingElement;

  // specific situation when anchor is animated
  // then go back from browser
  // we need to go on top of the page
  const handleHashChange = (e: Event): void => {
    e.preventDefault();

    const anchorHash = location.hash;
    const targetExists =
      anchorHash && !!root.querySelector(`[id="${anchorHash.slice(1)}"]`);

    if (targetExists || anchorHash === "#") {
      const _getEndLocation = () =>
        getEndLocation(root, anchorHash, scrollingElement);

      scrollTo({
        endLocation: _getEndLocation,
        duration: 600
      });
    }
  };

  const handleRootClick = (e: Event): void => {
    if (e.target instanceof Element) {
      const targetNode: HTMLAnchorElement | null =
        e.target.closest(anchorSelector);
      if (targetNode) {
        const anchorHash = targetNode.hash.trim();
        const targetHref = targetNode.href;
        const targetPath = targetHref.replace(anchorHash, "");

        const targetExists =
          anchorHash && !!root.querySelector(`[id="${anchorHash.slice(1)}"]`);

        if (
          anchorHash &&
          toSamePage(targetPath, location) &&
          (targetExists || anchorHash === "#")
        ) {
          e.preventDefault();

          const handleComplete = (): void => {
            history.pushState(null, "", anchorHash);
          };

          const _getEndLocation = () =>
            getEndLocation(root, anchorHash, scrollingElement);

          scrollTo({
            endLocation: _getEndLocation,
            duration: 600,
            targetNode
          }).then(handleComplete);
        }
      }
    }
  };

  const getLastPosition = (): void => {
    const position = window.location.hash.replace("#", "");

    if (position) {
      const target = document.getElementById(position);
      if (target) {
        handleHashChange(new Event("hashchange"));
      }
    }
  };

  const anchorBlockSelector = ".brz-anchor, .link--anchor, .link--external";

  root.querySelectorAll(anchorBlockSelector).forEach((anchor) => {
    const href = anchor.getAttribute("href");
    const hrefValue = href?.split("#")[1];

    if (!hrefValue) {
      return;
    }

    // For each anchor:
    // 1. If there's a section on the page with an id matching the href value, do nothing.
    // 2. If no matching id is found, check if a section has a matching data-brz-id.
    //    If so, get the anchorName from that section and update the href to use it
    //    so that scrolling to the section works correctly.

    const existingSection = !!document.getElementById(hrefValue);

    if (existingSection) {
      return;
    }

    const anchorSection = root.querySelector(
      makeDataAttrString({ name: "id", value: `'${hrefValue}'` })
    );

    if (anchorSection) {
      const id = anchorSection.getAttribute("id");

      anchor.setAttribute("href", `#${id}`);
    }
  });

  window.addEventListener("load", getLastPosition);
  window.addEventListener("hashchange", handleHashChange);
  root.addEventListener("click", handleRootClick);
}
