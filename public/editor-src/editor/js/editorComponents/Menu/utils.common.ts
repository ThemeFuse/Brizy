export const getParentMegaMenuUid = (target: Element): undefined | string =>
  target
    .closest(".brz-mega-menu__portal")
    ?.getAttribute("data-mega-menu-uid") ?? undefined;

export const isClonedSlide = (node: HTMLElement | null) => {
  const slickSlideNode = node?.closest(".slick-slide");

  return !!slickSlideNode?.classList.contains("slick-cloned");
};
