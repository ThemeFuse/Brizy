import { RefObject } from "react";
import Scrollbars from "react-custom-scrollbars";

export type ScrollbarType = Scrollbars & {
  view: Element;
};

export const scrollToActiveFont = (scrollbarRef: RefObject<ScrollbarType>) => {
  if (!scrollbarRef || !scrollbarRef.current) return;

  const activeFontElement: HTMLElement | null =
    scrollbarRef.current?.view.querySelector(".brz-ed-font__name.active");

  if (activeFontElement) {
    const value =
      activeFontElement.offsetTop - scrollbarRef.current.getClientHeight() / 2;

    scrollbarRef.current.scrollTop(value);
  }
};
