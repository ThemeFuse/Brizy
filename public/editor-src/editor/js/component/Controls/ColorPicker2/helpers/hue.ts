import { MouseEvent, TouchEvent } from "react";
import { HSLAwithSource } from "visual/component/Controls/ColorPicker2/types";

import HSLA = tinycolor.ColorFormats.HSLA;

export type Props = {
  e: MouseEvent | TouchEvent;
  contentWindow: Window;
  direction: string;
  hsl: HSLA;
  container: HTMLDivElement | null;
};

export const calculateChange = ({
  e,
  contentWindow,
  direction,
  hsl,
  container
}: Props): HSLAwithSource | null => {
  e.preventDefault();
  if (!container) return null;
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  // @ts-expect-error Event types
  const x = typeof e.pageX === "number" ? e.pageX : e.touches[0].pageX;
  // @ts-expect-error Event types
  const y = typeof e.pageY === "number" ? e.pageY : e.touches[0].pageY;
  const left =
    x - (container.getBoundingClientRect().left + contentWindow.pageXOffset);
  const top =
    y - (container.getBoundingClientRect().top + contentWindow.pageYOffset);

  if (direction === "vertical") {
    let h;
    if (top < 0) {
      h = 359;
    } else if (top > containerHeight) {
      h = 0;
    } else {
      const percent = -((top * 100) / containerHeight) + 100;
      h = (360 * percent) / 100;
    }

    if (hsl.h !== h) {
      return {
        h,
        s: hsl.s,
        l: hsl.l,
        a: hsl.a,
        source: "rgb"
      };
    }
  } else {
    let h;
    if (left < 0) {
      h = 0;
    } else if (left > containerWidth) {
      h = 359;
    } else {
      const percent = (left * 100) / containerWidth;
      h = (360 * percent) / 100;
    }

    if (hsl.h !== h) {
      return {
        h,
        s: hsl.s,
        l: hsl.l,
        a: hsl.a,
        source: "rgb"
      };
    }
  }
  return null;
};
