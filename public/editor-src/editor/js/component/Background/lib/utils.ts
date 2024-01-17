const isOverflowHidden = (element: HTMLElement) =>
  getComputedStyle(element).overflowX === "hidden" &&
  getComputedStyle(element).overflowY === "hidden";

export const hasScroll = (
  element: HTMLElement,
  iterationCount = 1
): boolean => {
  if (iterationCount > 3) {
    return false;
  }

  const hasScrollableContent =
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth;

  if (hasScrollableContent && !isOverflowHidden(element)) {
    return true;
  }

  return (
    !!element.parentElement &&
    hasScroll(element.parentElement, iterationCount + 1)
  );
};
