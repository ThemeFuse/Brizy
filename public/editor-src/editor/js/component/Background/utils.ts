import { debounce } from "es-toolkit";
import { useLayoutEffect as reactUseLayoutEffect, useEffect } from "react";
import { SwiperType } from "visual/types/global";
import { checkValue } from "visual/utils/checkValue";
import { MValue } from "visual/utils/value";
import { Transition } from "./type";

const updateStack = new Set<SwiperType>();

// React currently throws a warning when using useLayoutEffect on the server.
// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser. We need useLayoutEffect because we want
// `connect` to perform sync updates to a ref to save the latest props after
// a render is actually committed to the DOM.
export const useLayoutEffect =
  typeof window !== "undefined" ? reactUseLayoutEffect : useEffect;

export const readTransition = (v: unknown): MValue<Transition> =>
  checkValue<Transition>([
    Transition.Fade,
    Transition.SlideDown,
    Transition.SlideUp,
    Transition.SlideLeft,
    Transition.SlideRight
  ])(v);

export const getSlideType = (type: Transition): "horizontal" | "vertical" => {
  switch (type) {
    case Transition.Fade:
    case Transition.SlideLeft:
    case Transition.SlideRight:
      return "horizontal";
    case Transition.SlideUp:
    case Transition.SlideDown:
      return "vertical";
  }
};

const debouncedSwiperStart = debounce(() => {
  updateStack.forEach((swiper) => swiper.autoplay.start());
  updateStack.clear();
}, 200);

export const handleSwiperResize = (swiper: SwiperType): void => {
  const { running, stop } = swiper.autoplay;

  if (running) {
    stop();
    updateStack.add(swiper);
  }

  debouncedSwiperStart();
};
