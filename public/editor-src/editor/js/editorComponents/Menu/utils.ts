export const getParentMegaMenuUid = (target: Element): undefined | string =>
  target
    .closest(".brz-mega-menu__portal")
    ?.getAttribute("data-mega-menu-uid") ?? undefined;
