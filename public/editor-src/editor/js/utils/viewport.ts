export const isElementInViewport = (
  element: HTMLElement,
  innerHeight: number
): boolean => {
  const { top, bottom } = element.getBoundingClientRect();
  const elementHeight = element.offsetHeight;

  return top >= -elementHeight && bottom <= innerHeight + elementHeight;
};

export const getClosestSections = (document: Document, innerHeight: number) => {
  const sections = [...document.querySelectorAll(".brz-section")];
  const verticalCenter = innerHeight / 2;

  return sections.sort((a, b) => {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    const aCenterY = aRect.top + aRect.height / 2;
    const bCenterY = bRect.top + bRect.height / 2;

    const aDistance = Math.abs(verticalCenter - aCenterY);
    const bDistance = Math.abs(verticalCenter - bCenterY);

    return aDistance - bDistance;
  });
};

interface ScrollToActiveElement {
  activeElement: HTMLElement;
  document: Document;
  scrollTo: Window["scrollTo"];
  innerHeight: number;
  maxRecursion: number;
  previousTop?: number;
}

export const scrollToActiveElement = async ({
  activeElement,
  document,
  scrollTo,
  innerHeight,
  maxRecursion,
  previousTop
}: ScrollToActiveElement): Promise<boolean> => {
  const { height, width, top } = activeElement.getBoundingClientRect();
  const isElementVisibile = width > 0 && height > 0;
  const isArranged = top === previousTop;

  if (isElementVisibile && isArranged) {
    const viewportHeight = innerHeight;
    const scrollY =
      top +
      (document.scrollingElement?.scrollTop || 0) +
      height / 2 -
      viewportHeight / 2;

    scrollTo({
      top: scrollY,
      behavior: "smooth"
    });

    return Promise.resolve(true);
  }

  if (maxRecursion > 0) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        maxRecursion -= 1;
        resolve(
          await scrollToActiveElement({
            activeElement,
            document,
            scrollTo,
            innerHeight,
            maxRecursion,
            previousTop: top
          })
        );
      }, 100);
    });
  }

  return Promise.resolve(false);
};

export const scrollToClosestCenterSection = async (
  sections: HTMLElement[],
  document: Document,
  scrollTo: Window["scrollTo"],
  innerHeight: number
) => {
  for (const section of sections) {
    const res = await scrollToActiveElement({
      activeElement: section,
      document,
      scrollTo,
      innerHeight,
      maxRecursion: 5
    });
    if (res) break;
  }
};
