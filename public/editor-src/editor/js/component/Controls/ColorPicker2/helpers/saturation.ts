import { MouseEvent, TouchEvent } from "react";
import { HSVAwithSource } from "visual/component/Controls/ColorPicker2/types";

import HSLA = tinycolor.ColorFormats.HSLA;

export type Props = {
  e: MouseEvent | TouchEvent;
  contentWindow: Window;
  hsl: HSLA;
  container: HTMLDivElement | null;
};

export const calculateChange = ({
  e,
  contentWindow,
  hsl,
  container
}: Props): HSVAwithSource | null => {
  e.preventDefault();
  if (!container) return null;
  const { width: containerWidth, height: containerHeight } =
    container.getBoundingClientRect();
  // @ts-expect-error Event types
  const x = typeof e.pageX === "number" ? e.pageX : e.touches[0].pageX;
  // @ts-expect-error Event types
  const y = typeof e.pageY === "number" ? e.pageY : e.touches[0].pageY;
  let left =
    x - (container.getBoundingClientRect().left + contentWindow.pageXOffset);
  let top =
    y - (container.getBoundingClientRect().top + contentWindow.pageYOffset);

  if (left < 0) {
    left = 0;
  } else if (left > containerWidth) {
    left = containerWidth;
  } else if (top < 0) {
    top = 0;
  } else if (top > containerHeight) {
    top = containerHeight;
  }

  const saturation = (left * 100) / containerWidth;
  const bright = -((top * 100) / containerHeight) + 100;

  return {
    h: hsl.h,
    s: saturation,
    v: bright,
    a: hsl.a,
    source: "rgb"
  };
};
