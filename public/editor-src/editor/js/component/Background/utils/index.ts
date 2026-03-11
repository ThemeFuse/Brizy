import { useLayoutEffect as reactUseLayoutEffect, useEffect } from "react";
import { PopulationVars, Value } from "../type";

// React currently throws a warning when using useLayoutEffect on the server.
// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser. We need useLayoutEffect because we want
// `connect` to perform sync updates to a ref to save the latest props after
// a render is actually committed to the DOM.
export const useLayoutEffect =
  typeof window !== "undefined" ? reactUseLayoutEffect : useEffect;

export const setBgPopulationVars = (value: Value): Partial<PopulationVars> => {
  const { bg, tabletBg, mobileBg, hoverBg } = value;

  const _hoverBg = hoverBg || bg;
  const _tabletBg = tabletBg || bg;
  const _mobileBg = mobileBg || bg;

  const style: Partial<PopulationVars> = {};

  if (bg) {
    style["--brz-background-image"] = `url('${bg}')`;
  }

  if (_hoverBg) {
    style["--brz-hoverBackground-image"] = `url('${_hoverBg}')`;
  }

  if (_tabletBg) {
    style["--brz-tabletBackground-image"] = `url('${_tabletBg}')`;
  }

  if (_mobileBg) {
    style["--brz-mobileBackground-image"] = `url('${_mobileBg}')`;
  }

  return style;
};

export { getSlideType, handleSwiperResize, readTransition } from "./common";
