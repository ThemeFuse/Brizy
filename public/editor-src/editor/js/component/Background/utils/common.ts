import { debounce } from "es-toolkit";
import { SwiperType } from "visual/types/global";
import { checkValue } from "visual/utils/checkValue";
import { MValue } from "visual/utils/value";
import { Transition } from "../type";

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

const updateStack = new Set<SwiperType>();

const debouncedSwiperStart = debounce(() => {
  try {
    updateStack.forEach((swiper) => {
      try {
        swiper.autoplay.start();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("[Brz] Failed to restart swiper autoplay", e);
      }
    });
  } finally {
    updateStack.clear();
  }
}, 200);

export const handleSwiperResize = (swiper: SwiperType): void => {
  const { running, stop } = swiper.autoplay;

  if (running) {
    stop();
    updateStack.add(swiper);
  }

  debouncedSwiperStart();
};

export const readTransition = (v: unknown): MValue<Transition> =>
  checkValue<Transition>([
    Transition.Fade,
    Transition.SlideDown,
    Transition.SlideUp,
    Transition.SlideLeft,
    Transition.SlideRight
  ])(v);
