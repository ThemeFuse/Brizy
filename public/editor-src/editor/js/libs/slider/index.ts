import { Slider } from "./Slider";
import type { SliderHandle, SliderOptions } from "./types";

export { onSlider, SliderEvent } from "./events";
export type {
  SliderAccessibilityOptions,
  SliderBreakpoint,
  SliderBreakpointSettings,
  SliderEventDetail,
  SliderEventName,
  SliderHandle,
  SliderOptions
} from "./types";

/** Prepares the slider of `element` and returns the handle that drives it; `mount` builds it. */
export function createSlider(
  element: HTMLElement,
  options: SliderOptions
): SliderHandle {
  const slider = new Slider(element, options);

  return {
    on: slider.on,
    mount: slider.mount,
    play: slider.play,
    pause: slider.pause,
    goTo: slider.goTo,
    next: slider.next,
    prev: slider.prev,
    setPosition: slider.setPosition,
    setupAccessibility: slider.setupAccessibility
  };
}
