import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { Settings } from "./types";

export const getParentMegaMenuUid = (target: Element): undefined | string =>
  target
    .closest(".brz-mega-menu__portal")
    ?.getAttribute("data-mega-menu-uid") ?? undefined;

export const isClonedSlide = (node: HTMLElement | null) => {
  const slickSlideNode = node?.closest(".slick-slide");

  return !!slickSlideNode?.classList.contains("slick-cloned");
};

export const getPlacement = (
  isFirstLevel: boolean,
  mods?: Record<string, string>
): Settings["placement"] => ({
  [DESKTOP]:
    mods?.desktop === "horizontal" && isFirstLevel
      ? "bottom-start"
      : "right-start",
  [TABLET]: "bottom-start",
  [MOBILE]: "bottom-start"
});
