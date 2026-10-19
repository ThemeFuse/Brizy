import type { SliderEventDetail, SliderEventName } from "./types";

const domType = (name: SliderEventName): string => `brz-slider:${name}`;

/** A slider event: dispatched on the slider element, bubbles to its ancestors. */
export class SliderEvent extends Event {
  readonly detail: SliderEventDetail;
  caught: { error: unknown } | undefined = undefined;

  constructor(name: SliderEventName, detail: SliderEventDetail) {
    super(domType(name), { bubbles: true });
    this.detail = detail;
  }
}

export function emitSliderEvent(
  element: HTMLElement,
  name: SliderEventName,
  detail: SliderEventDetail
): void {
  const event = new SliderEvent(name, detail);
  element.dispatchEvent(event);

  if (event.caught) {
    throw event.caught.error;
  }
}

/** Listens to `name` on `element`, including events bubbled from nested sliders. */
export function onSlider(
  element: Element,
  name: SliderEventName,
  listener: (detail: SliderEventDetail) => void
): void {
  element.addEventListener(domType(name), (event) => {
    if (event instanceof SliderEvent) {
      try {
        listener(event.detail);
      } catch (error) {
        event.caught = { error };
        event.stopImmediatePropagation();
      }
    }
  });
}
