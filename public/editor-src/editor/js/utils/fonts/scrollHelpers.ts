import { RefObject } from "react";
import { ScrollbarRef } from "visual/component/Scrollbar";

export const scrollToActiveFont = (scrollbarRef: RefObject<ScrollbarRef>) => {
  if (!scrollbarRef || !scrollbarRef.current) return;

  const activeFontElement: HTMLElement | null =
    scrollbarRef.current?.view?.querySelector(".brz-ed-font__name.active") ??
    null;

  if (activeFontElement) {
    const value =
      activeFontElement.offsetTop - scrollbarRef.current.getClientHeight() / 2;

    scrollbarRef.current.scrollTop(value);
  }
};
